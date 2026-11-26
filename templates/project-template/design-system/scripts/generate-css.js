#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {
  isObject,
  isToken,
  isReferenceToken,
  fail,
  parseReference,
  referenceValue,
  pointerForPath,
  collectTokens,
  effectiveTokenAtPointer,
  effectiveTokenPointer,
  validateTokens,
  resolveTokenType,
  resolveRefType,
} = require('./token-utils');
const { serializeColor } = require('./contrast');

function cssNameFromToken(pathParts) {
  return pathParts.map((part) => {
    if (part === '$root') return 'root';
    return part
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[^A-Za-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
  }).filter(Boolean).join('-');
}

function customProperty(pathParts) {
  const name = cssNameFromToken(pathParts);
  if (!name) fail('Token path cannot produce a CSS custom-property name.', pathParts.join('.'));
  return `--${name}`;
}

function cssString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\a ')}"`;
}

function instantiate(doc, type, value, pointer, resolving) {
  if (isReferenceToken(value)) {
    if (resolving.includes(value.$ref)) fail(`Circular $ref ${value.$ref}.`, pointer);
    const reference = parseReference(value.$ref, doc);
    if (!reference || reference.target === undefined) fail(`Unresolved $ref ${value.$ref}.`, pointer);
    return instantiate(doc, type, referenceValue(doc, reference), reference.pointer, [...resolving, reference.pointer]);
  }
  if (typeof value === 'string') {
    const reference = parseReference(value, doc);
    if (reference) {
      if (reference.kind === 'pointer') {
        if (resolving.includes(reference.pointer)) fail(`Circular reference ${value}.`, pointer);
        return instantiate(doc, type, referenceValue(doc, reference), reference.pointer, [...resolving, reference.pointer]);
      }
      const effective = reference.kind === 'curly' ? effectiveTokenAtPointer(doc, reference.pointer) : undefined;
      if (reference.target === undefined && !effective) fail(`Unresolved reference ${value}.`, pointer);
      if (!isToken(reference.target) && !effective) fail(`Reference ${value} must target a complete token.`, pointer);
      if (resolving.includes(reference.pointer)) fail(`Circular reference ${value}.`, pointer);
      const target = effective || reference.target;
      const targetPointer = effective ? effectiveTokenPointer(doc, reference.pointer) : reference.pointer;
      const targetType = resolveTokenType(doc, target, targetPointer);
      if (targetType !== type) fail(`Reference ${value} resolves to ${targetType}, expected ${type}.`, pointer);
      return instantiate(doc, type, target.$value, targetPointer, [...resolving, targetPointer]);
    }
  }
  return value;
}

function formatNumber(number) {
  if (!Number.isFinite(number)) fail('Non-finite number cannot be represented in CSS.');
  return String(Number(number.toFixed(8)));
}

function formatColor(value, pointer) {
  if (!isObject(value)) fail('Color must be an object.', pointer);
  if (value.components.some((component) => component === 'none') && typeof value.hex === 'string') return value.hex.toLowerCase();
  try {
    return serializeColor(value);
  } catch (error) {
    fail(error.message, pointer);
  }
}

function validateCssValue(value, property, pointer) {
  if (typeof value !== 'string' || value.trim() === '') fail(`Generated CSS value for ${property} is empty or invalid.`, pointer);
  if (/[;{}]/.test(value)) fail(`Generated CSS value for ${property} contains a forbidden delimiter.`, pointer);
  return value;
}

function serializeFontFamily(value, pointer) {
  const generic = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong']);
  if (typeof value === 'string') return generic.has(value.toLowerCase()) ? value : cssString(value);
  if (Array.isArray(value)) return value.map((part) => generic.has(part.toLowerCase()) ? part : cssString(part)).join(', ');
  fail('Invalid font family value.', pointer);
}

function formatDimension(value, pointer) {
  if (!isObject(value) || typeof value.value !== 'number' || !['px', 'rem'].includes(value.unit)) fail('Invalid dimension value.', pointer);
  return `${formatNumber(value.value)}${value.unit}`;
}

function formatDuration(value, pointer) {
  if (!isObject(value) || typeof value.value !== 'number' || !['ms', 's'].includes(value.unit)) fail('Invalid duration value.', pointer);
  return `${formatNumber(value.value)}${value.unit}`;
}

function formatFontFamily(value, pointer) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.every((part) => typeof part === 'string')) return serializeFontFamily(value, pointer);
  fail('Invalid font family value.', pointer);
}

function formatCubicBezier(value, pointer) {
  if (!Array.isArray(value) || value.length !== 4) fail('Invalid cubicBezier value.', pointer);
  return `cubic-bezier(${value.map(formatNumber).join(', ')})`;
}

function resolveValue(doc, type, value, pointer, resolving) {
  return instantiate(doc, type, value, pointer, resolving);
}

function formatSubValue(doc, expectedType, value, pointer, resolving) {
  return formatByType(doc, expectedType, resolveValue(doc, expectedType, value, pointer, resolving), pointer, resolving);
}

function formatStrokeStyle(doc, value, pointer, resolving) {
  const resolved = resolveValue(doc, 'strokeStyle', value, pointer, resolving);
  if (typeof resolved === 'string') return resolved;
  fail('Object strokeStyle cannot be mapped losslessly to a CSS border style in this generator. Keep the token or add a documented CSS approximation outside generated token CSS.', pointer);
}

function formatBorder(doc, value, pointer, resolving) {
  const resolved = resolveValue(doc, 'border', value, pointer, resolving);
  if (!isObject(resolved)) fail('Border must be an object.', pointer);
  const width = formatSubValue(doc, 'dimension', resolved.width, `${pointer}.width`, resolving);
  const style = formatStrokeStyle(doc, resolved.style, `${pointer}.style`, resolving);
  const color = formatSubValue(doc, 'color', resolved.color, `${pointer}.color`, resolving);
  return `${width} ${style} ${color}`;
}

function formatTransition(doc, value, pointer, resolving) {
  const resolved = resolveValue(doc, 'transition', value, pointer, resolving);
  if (!isObject(resolved)) fail('Transition must be an object.', pointer);
  const duration = formatSubValue(doc, 'duration', resolved.duration, `${pointer}.duration`, resolving);
  const delay = formatSubValue(doc, 'duration', resolved.delay, `${pointer}.delay`, resolving);
  const timing = formatSubValue(doc, 'cubicBezier', resolved.timingFunction, `${pointer}.timingFunction`, resolving);
  return `${duration} ${timing} ${delay}`;
}

function formatShadowObject(doc, value, pointer, resolving) {
  if (!isObject(value)) fail('Shadow must be an object.', pointer);
  const inset = value.inset === true ? 'inset ' : '';
  const offsetX = formatSubValue(doc, 'dimension', value.offsetX, `${pointer}.offsetX`, resolving);
  const offsetY = formatSubValue(doc, 'dimension', value.offsetY, `${pointer}.offsetY`, resolving);
  const blur = formatSubValue(doc, 'dimension', value.blur, `${pointer}.blur`, resolving);
  const spread = formatSubValue(doc, 'dimension', value.spread, `${pointer}.spread`, resolving);
  const color = formatSubValue(doc, 'color', value.color, `${pointer}.color`, resolving);
  return `${inset}${offsetX} ${offsetY} ${blur} ${spread} ${color}`;
}

function formatShadow(doc, value, pointer, resolving) {
  const resolved = resolveValue(doc, 'shadow', value, pointer, resolving);
  if (!Array.isArray(resolved)) return formatShadowObject(doc, resolved, pointer, resolving);
  const shadows = [];
  for (let index = 0; index < resolved.length; index += 1) {
    const item = resolved[index];
    if (typeof item === 'string') {
      const reference = parseReference(item, doc);
      if (!reference || reference.target === undefined) fail(`Unresolved shadow reference ${item}.`, pointer);
      const target = resolveValue(doc, 'shadow', reference.target.$value, reference.pointer, resolving);
      if (Array.isArray(target)) shadows.push(...target.map((part, partIndex) => formatShadowObject(doc, part, `${reference.pointer}[${partIndex}]`, resolving)));
      else shadows.push(formatShadowObject(doc, target, reference.pointer, resolving));
    } else {
      shadows.push(formatShadowObject(doc, item, `${pointer}[${index}]`, resolving));
    }
  }
  return shadows.join(', ');
}

function formatByType(doc, type, value, pointer, resolving) {
  switch (type) {
    case 'color': return formatColor(value, pointer);
    case 'dimension': return formatDimension(value, pointer);
    case 'duration': return formatDuration(value, pointer);
    case 'fontFamily': return formatFontFamily(value, pointer);
    case 'fontWeight':
      if (typeof value === 'number' || typeof value === 'string') return String(value);
      fail('Invalid fontWeight value.', pointer);
      break;
    case 'cubicBezier': return formatCubicBezier(value, pointer);
    case 'number': return formatNumber(value);
    case 'strokeStyle': return formatStrokeStyle(doc, value, pointer, resolving);
    case 'border': return formatBorder(doc, value, pointer, resolving);
    case 'transition': return formatTransition(doc, value, pointer, resolving);
    case 'shadow': return formatShadow(doc, value, pointer, resolving);
    case 'typography': {
      fail('Typography generates multiple custom properties and must be expanded by the token emitter.', pointer);
      break;
    }
    case 'gradient':
      fail('The 2025.10 gradient value does not encode CSS gradient direction/type; add a documented project mapping before generating CSS.', pointer);
      break;
    default:
      fail(`Unsupported token type "${type}".`, pointer);
  }
}

function resolveTokenTypeForGeneration(doc, token, pointer) {
  const type = token.node.$type || token.inheritedType || (isReferenceToken(token.node) ? resolveRefType(doc, token.node.$ref, new Set([pointer])) : (typeof token.node.$value === 'string' ? resolveTokenType(doc, token.node, pointer) : undefined));
  if (!type) fail('Token has no determinable type.', pointer.slice(2).replace(/\//g, '.'));
  return type;
}

function renderTypography(doc, value, pointer, resolving) {
  const resolved = resolveValue(doc, 'typography', value, pointer, resolving);
  if (!isObject(resolved)) fail('Typography must be an object.', pointer);
  const lineHeight = resolved.lineHeight;
  return {
    typography: [
      ['font-family', formatSubValue(doc, 'fontFamily', resolved.fontFamily, `${pointer}.fontFamily`, resolving)],
      ['font-size', formatSubValue(doc, 'dimension', resolved.fontSize, `${pointer}.fontSize`, resolving)],
      ['font-weight', formatSubValue(doc, 'fontWeight', resolved.fontWeight, `${pointer}.fontWeight`, resolving)],
      ['letter-spacing', formatSubValue(doc, 'dimension', resolved.letterSpacing, `${pointer}.letterSpacing`, resolving)],
      ['line-height', formatSubValue(doc, 'number', lineHeight, `${pointer}.lineHeight`, resolving)],
    ],
  };
}

function generateCss(doc) {
  validateTokens(doc);
  const tokens = collectTokens(doc, { resolveExtensions: true });
  const declarations = [];
  for (const token of tokens) {
    const pointer = pointerForPath(token.pathParts);
    const type = resolveTokenTypeForGeneration(doc, token, pointer);
    const property = customProperty(token.pathParts);
    if (type === 'typography') {
      if (isReferenceToken(token.node)) {
        const resolved = instantiate(doc, type, token.node, pointer, [pointer]);
        const expanded = renderTypography(doc, resolved, pointer, [pointer]);
        for (const [role, cssValue] of expanded.typography) declarations.push([`${property}-${role}`, cssValue]);
      } else {
        const expanded = renderTypography(doc, token.node.$value, pointer, [pointer]);
        for (const [role, cssValue] of expanded.typography) declarations.push([`${property}-${role}`, cssValue]);
      }
    } else if (isReferenceToken(token.node)) {
      const resolved = instantiate(doc, type, token.node, pointer, [pointer]);
      declarations.push([property, formatByType(doc, type, resolved, pointer, [pointer])]);
    } else if (Array.isArray(token.node.$value)) {
      if (type === 'shadow') {
        declarations.push([property, formatShadow(doc, token.node.$value, pointer, [pointer])]);
      } else if (type === 'gradient') {
        fail('The 2025.10 gradient value does not encode CSS gradient direction/type; add a documented project mapping before generating CSS.', pointer);
      } else {
        declarations.push([property, formatByType(doc, type, token.node.$value, pointer, [pointer])]);
      }
    } else {
      const resolved = resolveValue(doc, type, token.node.$value, pointer, [pointer]);
      declarations.push([property, formatByType(doc, type, resolved, pointer, [pointer])]);
    }
  }
  return declarations;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`Cannot parse ${file}: ${error.message}`);
  }
}

function renderFile(declarations, template) {
  const lines = [];
  lines.push('/* Generated by scripts/generate-css.js from design-tokens.json. Do not edit manually. */');
  lines.push('');
  lines.push(':root {');
  let previous = '';
  for (const [property, value] of declarations) {
    validateCssValue(value, property, property);
    const group = property.split('-').slice(0, 3).join('-');
    if (previous && group !== previous) lines.push('');
    previous = group;
    lines.push(`  ${property}: ${value};`);
  }
  lines.push('}');
  lines.push('');
  if (template !== undefined) {
    lines.push('/* Project base styles from scripts/style-template.css. */');
    lines.push(template.trimEnd());
    lines.push('');
  }
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}`;
}

function generateFiles({ tokenFile, outputFile, templateFile }) {
  const doc = readJson(tokenFile);
  const template = templateFile && fs.existsSync(templateFile) ? fs.readFileSync(templateFile, 'utf8') : '';
  const declarations = generateCss(doc);
  const seen = new Set();
  for (const [property] of declarations) {
    if (seen.has(property)) fail(`Generated custom property collision: ${property}. Rename a token path.`);
    seen.add(property);
  }
  const output = renderFile(declarations, template);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, output, 'utf8');
  return { declarations: declarations.length, output };
}

function main() {
  const scriptDir = __dirname;
  const tokenFile = path.resolve(process.argv[2] || path.join(scriptDir, '..', 'design-tokens.json'));
  const outputFile = path.resolve(process.argv[3] || path.join(scriptDir, '..', 'style.css'));
  const templateFile = path.join(scriptDir, 'style-template.css');
  try {
    const result = generateFiles({ tokenFile, outputFile, templateFile });
    console.log(`Generated ${path.relative(process.cwd(), outputFile)} from ${path.relative(process.cwd(), tokenFile)} (${result.declarations} custom properties).`);
    process.exit(0);
  } catch (error) {
    console.error(`CSS generation failed: ${error.isTokenValidationError ? error.message : (error.stack || error)}`);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = { generateCss, generateFiles, readJson, renderFile, cssNameFromToken };
