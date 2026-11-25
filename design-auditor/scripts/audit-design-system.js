#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SUPPORTED_STATUSES = {
  design: new Set(['Not started', 'In progress', 'Approved']),
  prototype: new Set(['Not started', 'In progress', 'Completed', 'Reviewed']),
};

function walk(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  const files = [];
  for (const entry of entries) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(target, predicate));
    else if (predicate(target)) files.push(target);
  }
  return files;
}

function relative(root, file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function readJson(file) {
  try {
    return { value: JSON.parse(fs.readFileSync(file, 'utf8')) };
  } catch (error) {
    return { error: error.message };
  }
}

function add(finding, id, severity, file, message, correction, basis = 'Automated check', signature = '') {
  finding.push({ id, severity, file, message, correction, basis, signature });
}

function auditRequired(root, finding) {
  const required = [
    'base-rules.md', 'design-tokens.json', 'style.css', 'components.md',
    'exceptions.md', 'implementation-plan.md', 'changelog.md',
    'scripts/generate-css.js', 'scripts/validate-tokens.js',
  ];
  for (const name of required) {
    if (!fs.existsSync(path.join(root, name))) {
      add(finding, 'FILE-001', 'High', name, 'Required design-system artifact is missing.', `Add ${name} using the project template or document a justified replacement.`);
    }
  }
  if (!fs.existsSync(path.join(root, 'components'))) {
    add(finding, 'FILE-002', 'High', 'components/', 'Component directory is missing.', 'Create component directories for registered components.');
  }
}

function validateProjectTokens(validator, tokenDocument) {
  const validatorModule = require(validator);
  if (typeof validatorModule.validate === 'function') {
    return validatorModule.validate(tokenDocument).tokens.length;
  }
  return validatorModule.inspectFile(tokenDocument).tokens.length;
}

function auditRegistry(root, finding) {
  const file = path.join(root, 'components.md');
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const rows = lines.filter((line) => /^\|/.test(line) && !/^\|\s*(?:-+|:?-+:?)/.test(line));
  if (rows.length < 2) {
    add(finding, 'REG-001', 'Medium', 'components.md', 'Registry has no component data rows.', 'Add a row for each component using the required statuses.');
    return;
  }
  const headerIndex = lines.findIndex((line) => /^\|.*Component.*Design status.*Prototype status/i.test(line));
  if (headerIndex < 0) {
    add(finding, 'REG-002', 'Medium', 'components.md', 'Registry header does not expose Component, Design status, and Prototype status columns.', 'Use the registry table format from the workflow reference.');
    return;
  }
  for (let index = headerIndex + 2; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;
    if (!line.startsWith('|')) break;
    const cells = line.slice(1, -1).split('|').map((cell) => cell.trim());
    if (cells.length < 4) continue;
    const name = cells[0];
    const designStatus = cells[2].replace(/[*_`]/g, '').trim();
    const prototypeStatus = cells[3].replace(/[*_`]/g, '').trim();
    if (!SUPPORTED_STATUSES.design.has(designStatus)) {
      add(finding, 'REG-003', 'Medium', `${path.basename(root)}/components.md:${index + 1}`, `Invalid design status "${designStatus}" for ${name}.`, 'Use a required design status value.');
    }
    if (!SUPPORTED_STATUSES.prototype.has(prototypeStatus)) {
      add(finding, 'REG-004', 'Medium', `${path.basename(root)}/components.md:${index + 1}`, `Invalid prototype status "${prototypeStatus}" for ${name}.`, 'Use a required prototype status value.');
    }
    const componentDir = path.join(root, 'components', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    if (name && !fs.existsSync(componentDir)) {
      add(finding, 'REG-005', 'Low', `${path.basename(root)}/components.md:${index + 1}`, `No component directory was found for "${name}".`, `Create or link ${path.relative(root, componentDir)} if the component is in progress.`);
    }
    if (name && fs.existsSync(componentDir) && fs.existsSync(path.join(componentDir, 'component.md'))) {
      const spec = fs.readFileSync(path.join(componentDir, 'component.md'), 'utf8');
      if (/^##\s+State coverage\b/im.test(spec)) {
        const stateRows = spec.split(/\r?\n/).filter((row) => /^\|[^|]+\|/.test(row) && /CSS-reproducible|Static visual|Functional behavior/i.test(row));
        const normalizeState = (value) => value.toLowerCase().replace(/\/.*$/, '').replace(/\s+/g, ' ').trim();
        const specStates = new Set(stateRows.map((row) => normalizeState(row.split('|')[1].trim())));
        for (const name of [...specStates]) name.split('/').map((part) => part.trim()).filter(Boolean).forEach((part) => specStates.add(part));
        const registryStates = cells[4]
          .split(/[;,]/)
          .map(normalizeState)
          .filter(Boolean);
        for (const state of registryStates) {
          if (!specStates.has(state)) {
            const variantTerms = new Set((spec.match(/^##\s+Variants[ \t]*$([\s\S]*?)(?=^##\s+)/im) || ['', ''])[1].toLowerCase().split(/[^a-z0-9-]+/).filter((term) => term.length >= 3));
            if (![...variantTerms].some((term) => state.includes(term))) {
              add(finding, 'REG-006', 'Low', `${path.basename(root)}/components.md:${index + 1}`, `Registry lists "${state}" for ${name}, but neither the component state table nor variants section documents it.`, 'Align the registry state summary with the authoritative component specification.');
            }
          }
        }
      }
    }
  }
}

function stripCssComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '');
}

function auditPrototypes(root, finding) {
  const componentRoot = path.join(root, 'components');
  const files = walk(componentRoot);
  const cssFiles = files.filter((file) => file.endsWith('.css'));
  const htmlFiles = files.filter((file) => file.endsWith('.html'));
  const classesByComponent = new Map();
  for (const file of cssFiles) {
    const component = path.basename(path.dirname(file));
    const rawCss = fs.readFileSync(file, 'utf8');
    const css = stripCssComments(rawCss);
    if (/@import\s+(?:url\()?['"]?(?:https?:)?\/\//i.test(css)) {
      add(finding, 'CSS-001', 'Medium', relative(root, file), 'Component CSS imports a remote stylesheet, reducing determinism and privacy.', 'Use project-controlled assets and tokens.');
    }
    if (/!important/.test(css)) {
      add(finding, 'CSS-002', 'Low', relative(root, file), 'Component CSS uses !important.', 'Prefer specificity and documented state modifiers unless the exception is intentional.');
    }
    const selectorBlocks = css.replace(/@keyframes\s+[^{}]+\{[\s\S]*?\n\}/g, '').match(/(^|})\s*([^{}]+)\{/g) || [];
    const classes = new Set();
    for (const block of selectorBlocks) {
      const selector = block.replace(/^}\s*/, '').replace(/\s*\{$/, '');
      for (const match of selector.matchAll(/\.([A-Za-z0-9_-]+)/g)) {
        classes.add(match[1]);
        const base = match[1].split('__')[0].split('--')[0];
        if (base !== component && !base.startsWith('design-')) {
          const signature = `${relative(root, file)}:${match[1]}`;
          if (!finding.some((item) => item.signature === signature)) add(finding, 'BEM-001', 'Medium', `${relative(root, file)} (${selector.trim()})`, `Class "${match[1]}" is scoped outside component block "${component}".`, `Rename the selector under .${component} or document a composition boundary.`, 'Automated check', signature);
        }
      }
    }
    classesByComponent.set(component, { file: relative(root, file), classes, css });
  }
  for (const [component, info] of classesByComponent) {
    const specFile = path.join(componentRoot, component, 'component.md');
    if (!fs.existsSync(specFile)) continue;
    const spec = fs.readFileSync(specFile, 'utf8');
    const htmlInComponent = htmlFiles.filter((file) => path.basename(path.dirname(file)) === component);
    const htmlClasses = new Set();
    for (const file of htmlInComponent) {
      const html = fs.readFileSync(file, 'utf8');
      for (const match of html.matchAll(/class=["']([^"']+)["']/gi)) {
        match[1].split(/\s+/).filter(Boolean).forEach((value) => htmlClasses.add(value));
      }
    }
    for (const className of info.classes) {
      const isDocumentedState = spec.includes(className) || spec.includes(`.${className}`);
      if (!htmlClasses.has(className) && !isDocumentedState) {
        add(finding, 'BEM-002', 'Low', `${info.file} (.${className})`, `CSS class ".${className}" is absent from this component's examples and specification.`, 'Remove the unused selector or document and demonstrate the intended state.');
      }
    }
    for (const match of info.css.matchAll(/\.([A-Za-z0-9_-]+)::?[a-z-]+/g)) {
      const className = match[1];
      if (!htmlClasses.has(className) && !info.classes.has(className)) {
        add(finding, 'BEM-003', 'Low', info.file, `Pseudo-class selector references missing class ".${className}".`, 'Correct the selector or add the documented base state.');
      }
    }
  }
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    if (/<script\b/i.test(html)) {
      add(finding, 'PROTO-001', 'High', relative(root, file), 'JavaScript appears in a visual prototype.', 'Remove scripts and document functional behavior as unimplemented.');
    }
    if (/\son[a-z]+\s*=/i.test(html)) {
      add(finding, 'PROTO-002', 'High', relative(root, file), 'Inline event-handler markup appears in a visual prototype.', 'Remove event behavior; prototypes must not simulate functionality.');
    }
    if (/\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage)\b/.test(html)) {
      add(finding, 'PROTO-003', 'Medium', relative(root, file), 'Prototype mentions runtime state/data APIs.', 'Keep those requirements in documentation, not simulated prototype code.');
    }
    if (!/<html\b/i.test(html) || !/<body\b/i.test(html)) {
      add(finding, 'HTML-001', 'Low', relative(root, file), 'HTML example lacks a complete html/body document.', 'Provide a standalone visual example document.');
    }
    if (!/<link\b[^>]*href=["']\.\.\/\.\.\/style\.css["']/i.test(html)) {
      add(finding, 'HTML-002', 'Medium', relative(root, file), 'Example does not link the generated global stylesheet.', 'Link ../../style.css before the component stylesheet.');
    }
    if (!/<link\b[^>]*href=["']\.\/component\.css["']/i.test(html)) {
      add(finding, 'HTML-003', 'Medium', relative(root, file), 'Example does not link component.css.', 'Link ./component.css after the global stylesheet.');
    }
    const imgTags = html.match(/<img\b[^>]*>/gi) || [];
    for (const img of imgTags) {
      if (!/\balt\s*=/.test(img)) {
        add(finding, 'A11Y-001', 'High', relative(root, file), 'Image is missing an alt attribute.', 'Add meaningful alt text or alt="" for decorative images.');
      }
    }
    const buttons = html.match(/<button\b[^>]*>[\s\S]*?<\/button>/gi) || [];
    for (const button of buttons) {
      if (!/\baria-label\s*=/.test(button) && !/>\s*[^<\s][^<]*</.test(button)) {
        add(finding, 'A11Y-002', 'High', relative(root, file), 'Button appears to have no accessible text.', 'Provide visible text or an accurate accessible name.');
      }
    }
  }
  return { classesByComponent, cssFiles, htmlFiles };
}

function auditSpecs(root, finding) {
  const dirs = fs.existsSync(path.join(root, 'components')) ? fs.readdirSync(path.join(root, 'components'), { withFileTypes: true }).filter((entry) => entry.isDirectory()) : [];
  for (const entry of dirs) {
    const dir = path.join(root, 'components', entry.name);
    const spec = path.join(dir, 'component.md');
    const css = path.join(dir, 'component.css');
    const html = walk(dir, (file) => file.endsWith('.html'));
    if (!fs.existsSync(spec)) add(finding, 'SPEC-001', 'High', relative(root, spec), 'Component specification is missing.', 'Create component.md from the template.');
    if (!fs.existsSync(css)) add(finding, 'SPEC-002', 'High', relative(root, css), 'Component stylesheet is missing.', 'Create a scoped component.css.');
    if (html.length === 0) add(finding, 'SPEC-003', 'High', relative(root, dir), 'Component has no HTML visual examples.', 'Add a base HTML example and only the needed static-state examples.');
    if (fs.existsSync(spec)) {
      const text = fs.readFileSync(spec, 'utf8');
      const sections = ['Overview', 'Design specification', 'Variants', 'State coverage', 'Interactions and expected behavior', 'Responsive behavior', 'Accessibility requirements', 'Dependencies', 'Exceptions', 'References'];
      for (const section of sections) {
        if (!new RegExp(`^#{1,6}\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'im').test(text)) {
          add(finding, 'SPEC-004', 'Medium', relative(root, spec), `Missing "${section}" section in component specification.`, 'Complete the required specification section.');
        }
      }
      if (!/CSS-reproducible|Static visual|Functional behavior/i.test(text)) {
        add(finding, 'SPEC-005', 'High', relative(root, spec), 'State classification is absent.', 'Classify each required state as CSS-reproducible, static visual, or functional behavior.');
      }
    }
  }
}

function findDocumentedContrastPairs(root, finding) {
  const file = path.join(root, 'base-rules.md');
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, 'utf8');
  const pattern = /contrast(?: pair)?\s*:\s*(#[0-9a-f]{6})\s+(?:on|over|against)\s+(#[0-9a-f]{6})/gi;
  for (const match of text.matchAll(pattern)) {
    const [ratio, fg, bg] = contrast(match[1], match[2]);
    const largeText = 3.0;
    add(finding, ratio >= 4.5 ? 'INFO-001' : 'INFO-003', 'Info', 'base-rules.md', `Documented contrast pair ${fg} on ${bg} is ${ratio.toFixed(2)}:1.`, ratio >= 4.5 ? 'Meets the normal-text numeric threshold; confirm the actual role/state and manual accessibility separately.' : (ratio >= largeText ? 'Meets only the large-text/UI threshold candidates; confirm font size, weight, role, and state before approval.' : 'Below all common AA contrast thresholds; increase contrast or record the applicable requirement and explicit risk.'), 'WCAG 2.2 contrast review; role-specific manual judgment required');
  }
}

function rgb(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255);
}

function luminance(hex) {
  const channels = rgb(hex).map((channel) => channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a, b) {
  const first = luminance(a);
  const second = luminance(b);
  const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  return [ratio, a, b];
}

function auditTokens(root, finding) {
  const validator = path.join(root, 'scripts', 'validate-tokens.js');
  const tokens = path.join(root, 'design-tokens.json');
  if (!fs.existsSync(tokens)) return;
  if (fs.existsSync(validator)) {
    const validation = readJson(tokens);
    if (validation.error) {
      add(finding, 'TOKEN-002', 'High', 'design-tokens.json', `Token JSON is invalid: ${validation.error}`, 'Fix JSON syntax, then validate and regenerate CSS.');
    } else {
      try {
        const tokenCount = validateProjectTokens(validator, validation.value);
        add(finding, 'INFO-002', 'Info', 'design-tokens.json', `Project token validator reports PASS for ${tokenCount} tokens.`, 'Review platform suitability and contrast separately; format validity is not design approval.');
      } catch (error) {
        add(finding, 'TOKEN-002', 'High', 'design-tokens.json', `Project token validation failed: ${error.message}`, 'Fix token-format and reference findings, then regenerate CSS.');
      }
    }
  } else {
    add(finding, 'TOKEN-003', 'High', 'scripts/validate-tokens.js', 'Token validator is unavailable, so token-format correctness was not verified.', 'Add the supplied validator or an equivalent 2025.10-compatible validator.');
  }
}

function auditFreshCss(root, finding) {
  const generator = path.join(root, 'scripts', 'generate-css.js');
  const tokens = path.join(root, 'design-tokens.json');
  const css = path.join(root, 'style.css');
  if (!fs.existsSync(generator) || !fs.existsSync(tokens) || !fs.existsSync(css)) return;
  try {
    const generatorModule = require(generator);
    const tokenDocument = JSON.parse(fs.readFileSync(tokens, 'utf8'));
    const template = fs.existsSync(path.join(root, 'scripts', 'style-template.css')) ? fs.readFileSync(path.join(root, 'scripts', 'style-template.css'), 'utf8') : '';
    const generatorContext = { templateFile: path.join(root, 'scripts', 'style-template.css') };
    let generated;
    try {
      generatorModule.generateCss(tokenDocument, generatorContext);
    } catch (error) {
      add(finding, 'CSS-006', 'High', 'design-tokens.json', `Token-to-CSS mapping failed: ${error.message}`, 'Use supported token values or extend the generator with a documented mapping.');
      return;
    }
    generated = generatorModule.renderFile(generatorModule.generateCss(tokenDocument, generatorContext), template);
    const current = fs.readFileSync(css, 'utf8');
    if (generated !== current) add(finding, 'CSS-005', 'High', 'style.css', 'Checked-in global stylesheet differs from fresh generator output.', 'Run the project CSS generator and commit its output.');
  } catch (error) {
    add(finding, 'CSS-004', 'High', 'scripts/generate-css.js', `CSS generation check failed: ${error.message}`, 'Repair the generator input or unresolved token reference.');
  }
}

function auditExceptions(root, finding) {
  const file = path.join(root, 'exceptions.md');
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, 'utf8');
  if (!/None\./.test(text) && !/^\|.*Component/im.test(text)) {
    add(finding, 'EXC-001', 'Low', 'exceptions.md', 'Exception registry is neither explicitly empty nor tabular.', 'State "None." or document each exception with scope and accessibility impact.');
  }
}

function printReport(root, finding) {
  const severityOrder = ['Critical', 'High', 'Medium', 'Low', 'Info'];
  finding.sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity) || a.file.localeCompare(b.file));
  const counts = Object.fromEntries(severityOrder.map((severity) => [severity, finding.filter((item) => item.severity === severity).length]));
  console.log(`# Design-system audit: ${root}`);
  console.log('');
  console.log(`Automated findings: ${['Critical', 'High', 'Medium', 'Low'].map((severity) => `${severity} ${counts[severity]}`).join(', ')}; Info ${counts.Info}.`);
  console.log('Automated checks inspect structure and static evidence only; complete accessibility and runtime behavior require manual review.');
  console.log('');
  if (finding.length === 0) {
    console.log('No automated findings.');
  } else {
    console.log('| ID | Severity | Location | Explanation | Recommended correction | Basis |');
    console.log('|---|---|---|---|---|---|');
    for (const item of finding) {
      const cell = (value) => String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
      console.log(`| ${cell(item.id)} | ${cell(item.severity)} | ${cell(item.file)} | ${cell(item.message)} | ${cell(item.correction)} | ${cell(item.basis)} |`);
    }
  }
  console.log('');
  console.log('Manual review still required: UX quality, visual consistency, keyboard behavior, dynamic semantics, platform conventions, and responsive content.');
  process.exitCode = counts.Critical > 0 || counts.High > 0 || counts.Medium > 0 ? 1 : 0;
}

function auditSystem(inputRoot) {
  const root = path.resolve(inputRoot || 'design-system');
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`Audit target is not a directory: ${root}`);
  }
  const finding = [];
  auditRequired(root, finding);
  auditRegistry(root, finding);
  auditPrototypes(root, finding);
  auditSpecs(root, finding);
  auditTokens(root, finding);
  auditFreshCss(root, finding);
  auditExceptions(root, finding);
  findDocumentedContrastPairs(root, finding);
  return finding;
}

function main() {
  const root = path.resolve(process.argv[2] || 'design-system');
  try {
    const finding = auditSystem(root);
    printReport(root, finding);
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }
}

if (require.main === module) main();

module.exports = { auditSystem };
