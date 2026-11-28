#!/usr/bin/env node

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

async function loadAnalyzer() {
  const module = await import('@semantic-release/commit-analyzer');
  return module.analyzeCommits;
}

function tempProject() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'design-designer-release-'));
}

function write(file, cwd, value) {
  fs.writeFileSync(path.join(cwd, file), value, 'utf8');
}

async function testVersionFiles() {
  const { updateVersion } = require('./update-version.js');
  const cwd = tempProject();
  const before = '# Example\n\nKeep this text.\n\n';
  const after = '\n\nKeep this text after the marker.\n';
  write('README.md', cwd, `${before}<!-- VERSION:START -->\n**Current version:** v0.0.0\n<!-- VERSION:END -->${after}`);
  write('VERSION', cwd, '0.0.0\n');
  write('version.json', cwd, '{\n  "name": "example",\n  "version": "0.0.0",\n  "nested": { "version": "keep" }\n}\n');

  updateVersion('2.3.4', cwd);
  assert.equal(
    fs.readFileSync(path.join(cwd, 'README.md'), 'utf8'),
    `${before}<!-- VERSION:START -->\n**Current version:** v2.3.4\n<!-- VERSION:END -->${after}`,
  );
  assert.equal(fs.readFileSync(path.join(cwd, 'VERSION'), 'utf8'), '2.3.4\n');
  assert.equal(
    fs.readFileSync(path.join(cwd, 'version.json'), 'utf8'),
    '{\n  "name": "example",\n  "version": "2.3.4",\n  "nested": { "version": "keep" }\n}\n',
  );

  const readmeBeforeSecondRun = fs.readFileSync(path.join(cwd, 'README.md'), 'utf8');
  updateVersion('2.3.4', cwd);
  assert.equal(fs.readFileSync(path.join(cwd, 'README.md'), 'utf8'), readmeBeforeSecondRun);

  assert.throws(() => updateVersion('not-a-version', cwd), /Invalid semantic version/);

  write('README.md', cwd, '# Broken\n\n<!-- VERSION:START -->\nNo end marker.\n');
  assert.throws(() => updateVersion('2.3.5', cwd), /ordered VERSION:START\/VERSION:END block/);
  assert.equal(fs.readFileSync(path.join(cwd, 'README.md'), 'utf8'), '# Broken\n\n<!-- VERSION:START -->\nNo end marker.\n');
  fs.rmSync(cwd, { recursive: true, force: true });
}

async function testCommitRules() {
  const analyzeCommits = await loadAnalyzer();
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, '.releaserc.json'), 'utf8'));
  const plugin = config.plugins.find((entry) => Array.isArray(entry) && entry[0] === '@semantic-release/commit-analyzer');
  const pluginConfig = plugin[1];
  const context = {
    cwd: ROOT,
    logger: { log() {}, warn() {}, error() {} },
  };
  const cases = [
    ['feat: add capability', 'minor'],
    ['fix: repair behavior', 'patch'],
    ['perf: reduce work', 'patch'],
    ['revert: undo a change', 'patch'],
    ['Revert "feat: add capability"\n\nThis reverts commit 0123456.', 'patch'],
    ['feat!: replace public contract', 'major'],
    ['fix(core)!: change output', 'major'],
    ['fix: repair\n\nBREAKING CHANGE: callers must migrate', 'major'],
    ['docs: clarify usage', null],
    ['test: extend coverage', null],
    ['ci: adjust automation', null],
    ['chore: update metadata', null],
    ['refactor: reorganize internals', null],
    [':bug: merge a legacy pull request', null],
  ];

  for (const [message, expected] of cases) {
    const actual = await analyzeCommits(pluginConfig, {
      ...context,
      commits: [{ hash: '0123456789abcdef', message }],
    });
    assert.equal(actual, expected, message);
  }

  const highest = await analyzeCommits(pluginConfig, {
    ...context,
    commits: [
      { hash: '1', message: 'fix: repair behavior' },
      { hash: '2', message: 'docs: clarify usage' },
      { hash: '3', message: 'feat: add capability' },
    ],
  });
  assert.equal(highest, 'minor');
}

async function main() {
  await testVersionFiles();
  await testCommitRules();
  process.stdout.write('Release tooling tests passed.\n');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
