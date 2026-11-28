#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const README_START = '<!-- VERSION:START -->';
const README_END = '<!-- VERSION:END -->';
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function fail(message) {
  throw new Error(message);
}

function parseVersion(value) {
  const version = String(value).replace(/^v/, '');
  if (!SEMVER.test(version)) {
    fail(`Invalid semantic version: ${value}`);
  }
  return version;
}

function readOptional(file, cwd) {
  const target = path.join(cwd, file);
  return fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
}

function writeIfChanged(file, original, next, cwd) {
  if (original === next) return false;
  fs.writeFileSync(path.join(cwd, file), next, 'utf8');
  return true;
}

function updateReadme(version, cwd) {
  const original = readOptional('README.md', cwd);
  if (original === null) fail('README.md does not exist.');

  const start = original.indexOf(README_START);
  const end = original.indexOf(README_END);
  if (start === -1 || end === -1 || end < start) {
    fail('README.md must contain one ordered VERSION:START/VERSION:END block.');
  }
  if (original.indexOf(README_START, start + README_START.length) !== -1 ||
      original.indexOf(README_END, end + README_END.length) !== -1) {
    fail('README.md must contain exactly one VERSION block.');
  }

  const block = `${README_START}\n**Current version:** v${version}\n${README_END}`;
  return writeIfChanged(
    'README.md',
    original,
    original.slice(0, start) + block + original.slice(end + README_END.length),
    cwd,
  );
}

function updatePlainVersion(version, cwd) {
  const original = readOptional('VERSION', cwd);
  if (original === null) return false;
  const current = original.trimEnd();
  if (current && !SEMVER.test(current.replace(/^v/, ''))) {
    fail('VERSION must contain only a semantic version.');
  }
  return writeIfChanged('VERSION', original, `${version}\n`, cwd);
}

function updateJsonVersion(version, cwd) {
  const original = readOptional('version.json', cwd);
  if (original === null) return false;

  let document;
  try {
    document = JSON.parse(original);
  } catch (error) {
    fail(`version.json is not valid JSON: ${error.message}`);
  }
  if (!document || Array.isArray(document) || typeof document !== 'object') {
    fail('version.json must contain a JSON object.');
  }
  if (typeof document.version !== 'string' && document.version !== undefined) {
    fail('version.json version must be a string when present.');
  }

  const versionPattern = /("version"\s*:\s*)"[^"\\]*(?:\\.[^"\\]*)*"/;
  if (!versionPattern.test(original)) {
    fail('version.json must contain a top-level "version" string.');
  }
  return writeIfChanged('version.json', original, original.replace(versionPattern, `$1"${version}"`), cwd);
}

function updateVersion(value, cwd = process.cwd()) {
  const version = parseVersion(value);
  const changed = [
    updateReadme(version, cwd),
    updatePlainVersion(version, cwd),
    updateJsonVersion(version, cwd),
  ].filter(Boolean).length;
  process.stdout.write(`Updated ${changed} version file(s) to ${version}.\n`);
  return version;
}

if (require.main === module) {
  const value = process.argv[2];
  try {
    if (!value) fail('Usage: node scripts/update-version.js <version>');
    updateVersion(value);
  } catch (error) {
    console.error(`Version update failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { parseVersion, updateVersion };
