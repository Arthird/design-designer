#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {
  parseReference,
  collectTokens,
  collectGroups,
  validateTokens,
} = require('./token-utils');

function inspectFile(doc) {
  const tokens = collectTokens(doc);
  const groups = collectGroups(doc);
  const typeCounts = {};
  let aliases = 0;
  let deprecated = 0;
  for (const token of tokens) {
    const type = token.node.$type || token.inheritedType || 'alias/inherited';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
    if (typeof token.node.$value === 'string' && parseReference(token.node.$value, doc)) aliases += 1;
    if (token.node.$deprecated === true || typeof token.node.$deprecated === 'string') deprecated += 1;
  }
  return { tokens, groups, typeCounts, aliases, deprecated };
}

function validate(doc) {
  const result = validateTokens(doc);
  const summary = inspectFile(doc);
  return { ...result, summary };
}

function formatError(error) {
  if (error && error.isTokenValidationError) return `Token error: ${error.message}`;
  return error && error.stack ? error.stack : String(error);
}

function main() {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '..', 'design-tokens.json'));
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (error) {
    console.error(`Cannot read ${file}: ${error.message}`);
    process.exit(2);
  }
  let doc;
  try {
    doc = JSON.parse(raw);
  } catch (error) {
    console.error(`Invalid JSON in ${file}: ${error.message}`);
    process.exit(1);
  }
  try {
    const result = validate(doc);
    console.log(`PASS: ${path.basename(file)} is structurally valid for the supported Design Tokens 2025.10 subset.`);
    console.log(`Tokens: ${result.tokens.length}; groups: ${result.groups.length}; aliases: ${result.summary.aliases}; deprecated: ${result.summary.deprecated}.`);
    console.log(`Types: ${Object.entries(result.summary.typeCounts).sort(([a], [b]) => a.localeCompare(b)).map(([type, count]) => `${type} ${count}`).join(', ')}.`);
    console.log('NOT CHECKED: contrast, platform suitability, visual design, and complete accessibility.');
    process.exit(0);
  } catch (error) {
    console.error(`FAIL: ${formatError(error)}`);
    console.error('Format and reference validation only; accessibility and platform compatibility require separate review.');
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = { validate, inspectFile };
