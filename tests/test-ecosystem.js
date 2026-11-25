#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const template = path.join(root, 'design-designer', 'assets', 'project-template', 'design-system');
const auditor = path.join(root, 'design-auditor', 'scripts', 'audit-design-system.js');
const skills = ['design-designer', 'design-coder', 'design-auditor', 'token-writer'];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert.throws = function assertThrows(fn, pattern, message) {
  try {
    fn();
  } catch (error) {
    assert(pattern.test(error.message), `${message}: unexpected error ${error.message}`);
    return;
  }
  throw new Error(`${message}: expected an error`);
};

function copyDir(source, destination) {
  fs.cpSync(source, destination, { recursive: true });
}

function checkSkills() {
  for (const name of skills) {
    const file = path.join(root, name, 'SKILL.md');
    assert(fs.existsSync(file), `Missing ${name}/SKILL.md`);
    const text = fs.readFileSync(file, 'utf8');
    assert(text.includes(`name: ${name}`), `${name}/SKILL.md has wrong name`);
    assert(!text.includes('[TODO:'), `${name}/SKILL.md has unfinished scaffold TODO`);
  }
}

function checkTemplate() {
  const required = [
    'base-rules.md', 'design-tokens.json', 'style.css', 'components.md',
    'exceptions.md', 'implementation-plan.md', 'changelog.md',
    'components/button/component.md', 'components/button/component.css',
    'components/button/button.html', 'components/button/button-disabled.html',
    'components/button/button-loading.html', 'scripts/generate-css.js',
    'scripts/validate-tokens.js', 'scripts/token-utils.js', 'scripts/style-template.css'
  ];
  for (const relative of required) assert(fs.existsSync(path.join(template, relative)), `Missing template ${relative}`);
  assert(fs.existsSync(path.join(template, 'scripts', 'test-token-tools.js')), 'Token fixture test is missing');
}

function checkTsIdempotence() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-designer-positive-'));
  try {
    const project = path.join(temp, 'design-system');
    copyDir(template, project);
    const { validate } = require(path.join(project, 'scripts', 'validate-tokens.js'));
    const { generateFiles, readJson } = require(path.join(project, 'scripts', 'generate-css.js'));
    validate(readJson(path.join(project, 'design-tokens.json')));
    const before = fs.readFileSync(path.join(project, 'style.css'), 'utf8');
    generateFiles({
      tokenFile: path.join(project, 'design-tokens.json'),
      outputFile: path.join(project, 'style.css'),
      templateFile: path.join(project, 'scripts', 'style-template.css')
    });
    const first = fs.readFileSync(path.join(project, 'style.css'), 'utf8');
    generateFiles({
      tokenFile: path.join(project, 'design-tokens.json'),
      outputFile: path.join(project, 'style.css'),
      templateFile: path.join(project, 'scripts', 'style-template.css')
    });
    const second = fs.readFileSync(path.join(project, 'style.css'), 'utf8');
    assert(first === second, 'CSS generation is not byte-for-byte deterministic');
    assert(first === before, 'Committed generated style.css is stale');
    const { auditSystem } = require(auditor);
    const findings = auditSystem(project);
    assert(findings.some((item) => /^INFO-00[12]$/.test(item.id)), 'Expected token/contrast info evidence in audit');
    assert(!findings.some((item) => ['Critical', 'High', 'Medium'].includes(item.severity)), 'Positive audit reported actionable failure');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

function checkNegativeTokens() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-designer-negative-'));
  try {
    const invalidJson = path.join(temp, 'invalid.json');
    fs.writeFileSync(invalidJson, '{"color": ', 'utf8');
    assert.throws(() => readJsonOrThrow(invalidJson), /Cannot parse/, 'Malformed JSON was not rejected');

    const unresolvedFile = path.join(temp, 'unresolved.json');
    fs.writeFileSync(unresolvedFile, JSON.stringify({ color: { $type: 'color', bad: { $value: '{missing.color}' } } }), 'utf8');
    const { validate } = require(path.join(template, 'scripts', 'validate-tokens.js'));
    assert.throws(() => validate(JSON.parse(fs.readFileSync(unresolvedFile, 'utf8'))), /Unresolved reference/, 'Unresolved alias was not rejected');

    const badTypeFile = path.join(temp, 'bad-type.json');
    fs.writeFileSync(badTypeFile, JSON.stringify({ size: { $type: 'dimension', bad: { $value: { value: 1, unit: 'em' } } } }), 'utf8');
    assert.throws(() => validate(JSON.parse(fs.readFileSync(badTypeFile, 'utf8'))), /unit must be px or rem/, 'Unsupported dimension unit was not rejected');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

function checkNegativeAudit() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-designer-audit-negative-'));
  try {
    const project = path.join(temp, 'design-system');
    copyDir(template, project);
    fs.appendFileSync(path.join(project, 'components', 'button', 'button.html'), '\n<script>document.addEventListener("click", () => {});</script>\n');
    fs.writeFileSync(path.join(project, 'components', 'button', 'component.css'), '.input { color: red; }\n', 'utf8');
    const { auditSystem } = require(auditor);
    const findings = auditSystem(project);
    assert(findings.some((item) => item.id === 'PROTO-001'), 'JavaScript in prototype was not reported');
    assert(findings.some((item) => item.id === 'BEM-001'), 'Out-of-scope BEM class was not reported');
    assert(findings.some((item) => item.severity === 'High'), 'High-severity finding missing');
    assert(findings.some((item) => item.severity === 'Medium'), 'Medium-severity finding missing');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

function checkStaleCssAndRegistry() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-designer-audit-stale-'));
  try {
    const project = path.join(temp, 'design-system');
    copyDir(template, project);
    fs.appendFileSync(path.join(project, 'style.css'), '\n.changed { color: red; }\n');
    fs.writeFileSync(path.join(project, 'design-tokens.json'), JSON.stringify({ color: { $type: 'color', bad: { $value: { colorSpace: 'srgb', components: [2, 0, 0] } } } }), 'utf8');
    fs.writeFileSync(path.join(project, 'components.md'), '| Component | Purpose | Design status | Prototype status | Variants / States | Exceptions |\n|---|---|---|---|---|---|\n| Button | Action | Done | Finished | default | None |\n', 'utf8');
    const { auditSystem } = require(auditor);
    const findings = auditSystem(project);
    assert(findings.some((item) => item.id === 'REG-003') && findings.some((item) => item.id === 'REG-004'), 'Invalid registry statuses were not reported');
    assert(findings.some((item) => item.id === 'TOKEN-002'), 'Invalid token data in the audit fixture was not reported');
    assert(findings.some((item) => item.id === 'CSS-006'), 'Invalid token values should fail token-to-CSS mapping independently of stale output');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

function checkRegistryStateMismatch() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-designer-registry-state-'));
  try {
    const project = path.join(temp, 'design-system');
    copyDir(template, project);
    fs.writeFileSync(path.join(project, 'components.md'), '| Component | Purpose | Design status | Prototype status | Variants / States | Exceptions |\n|---|---|---|---|---|---|\n| Button | Action | Approved | Reviewed | default; mysterious | None |\n', 'utf8');
    const { auditSystem } = require(auditor);
    const findings = auditSystem(project);
    assert(findings.some((item) => item.id === 'REG-006' && /mysterious/.test(item.message)), 'Registry/spec state mismatch was not reported');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

function checkStaleCss() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-designer-audit-stale-css-'));
  try {
    const project = path.join(temp, 'design-system');
    copyDir(template, project);
    fs.appendFileSync(path.join(project, 'style.css'), '\n.changed { color: red; }\n');
    const { auditSystem } = require(auditor);
    const findings = auditSystem(project);
    assert(findings.some((item) => item.id === 'CSS-005'), 'Stale generated CSS was not reported');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

function checkAuditSummaryEncoding() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-designer-summary-'));
  try {
    const project = path.join(temp, 'design-system');
    copyDir(template, project);
    fs.appendFileSync(path.join(project, 'components', 'button', 'button.html'), '\n<script>console.log("x");</script>\n');
    const { auditSystem } = require(auditor);
    const findings = auditSystem(project);
    assert(findings.some((item) => item.id === 'PROTO-001'), 'Prototype script fixture was not detected');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

function checkNoPrototypeJs() {
  const htmlFiles = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (file.endsWith('.html')) htmlFiles.push(file);
    }
  }
  visit(path.join(template, 'components'));
  assert(htmlFiles.length > 0, 'No prototype HTML found');
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    assert(!/<script\b/i.test(html) && !/\son[a-z]+\s*=/i.test(html), `JavaScript behavior found in ${path.relative(root, file)}`);
  }
}

function checkSkillRouting() {
  const files = {
    orchestrator: path.join(root, 'design-designer', 'SKILL.md'),
    coder: path.join(root, 'design-coder', 'SKILL.md'),
    auditor: path.join(root, 'design-auditor', 'SKILL.md'),
    tokens: path.join(root, 'token-writer', 'SKILL.md'),
  };
  const text = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, fs.readFileSync(file, 'utf8')]));
  assert(/\$token-writer/.test(text.orchestrator) && /\$design-coder/.test(text.orchestrator) && /\$design-auditor/.test(text.orchestrator), 'Orchestrator does not route to all subskills');
  assert(/Do not add placeholder JavaScript|No JavaScript/i.test(text.coder), 'Coder does not prohibit prototype JavaScript');
  assert(/Automated checks.*accessibility|does not prove complete accessibility/i.test(text.auditor), 'Auditor does not bound automated accessibility claims');
  assert(/Never manually edit|rather than writing CSS/.test(text.tokens), 'Token writer does not preserve generated-CSS custody');
}

function checkOptionalIntegrationHonesty() {
  const orchestrator = fs.readFileSync(path.join(root, 'design-designer', 'SKILL.md'), 'utf8');
  assert(/ui-ux-pro-max-skill/.test(orchestrator), 'Orchestrator does not inspect optional design intelligence');
  assert(/If absent, do not imply it was used/.test(orchestrator), 'Orchestrator does not define unavailable-integration behavior');
}

function main() {
  checkSkills();
  checkTemplate();
  checkTsIdempotence();
  checkNegativeTokens();
  checkNegativeAudit();
  checkStaleCss();
  checkAuditSummaryEncoding();
  checkStaleCssAndRegistry();
  checkRegistryStateMismatch();
  checkNoPrototypeJs();
  checkSkillRouting();
  checkOptionalIntegrationHonesty();
  console.log(`PASS: ${skills.length} skills, template, token fixtures, generation determinism, and positive/negative audits`);
}

function readJsonOrThrow(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot parse ${file}: ${error.message}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
}
