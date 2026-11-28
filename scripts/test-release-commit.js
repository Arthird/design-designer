#!/usr/bin/env node

'use strict';

const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const FILES = [
  '.releaserc.json',
  'README.md',
  'package.json',
  'package-lock.json',
  'scripts/release-rules.cjs',
  'scripts/update-version.js',
  'shared/VERSIONING.md',
  'shared/workflow/manual-verification.md',
  'skills/working/README.md',
  'skills/knowledge/README.md',
];

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function copy(file, cwd) {
  const target = path.join(cwd, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(ROOT, file), target);
}

function main() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'design-designer-release-commit-'));
  const remote = path.join(root, 'origin.git');
  const repo = path.join(root, 'repo');
  git(root, 'init', '--bare', remote);
  git(root, 'clone', `file://${remote}`, repo);

  for (const file of FILES) copy(file, repo);
  fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(repo, 'node_modules'), 'dir');
  git(repo, 'config', 'user.name', 'Release Test');
  git(repo, 'config', 'user.email', 'release-test@example.invalid');
  git(repo, 'add', '.');
  git(repo, 'commit', '-m', 'chore: initialize release test');
  git(repo, 'tag', 'v1.0.0');
  git(repo, 'branch', '-M', 'master');
  git(repo, 'push', 'origin', 'HEAD:master', '--tags');
  git(repo, 'branch', '--set-upstream-to=origin/master');
  git(repo, 'commit', '--allow-empty', '-m', 'fix: verify release commit');
  git(repo, 'push', 'origin', 'HEAD:master');

  const configPath = path.join(repo, '.releaserc.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.plugins = config.plugins.filter((plugin) => plugin !== '@semantic-release/github');
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  git(repo, 'add', '.releaserc.json');
  git(repo, 'commit', '-m', 'chore: isolate GitHub plugin');
  git(repo, 'push', 'origin', 'HEAD:master');

  const result = spawnSync(path.join(ROOT, 'node_modules/.bin/semantic-release'), [], {
    cwd: repo,
    encoding: 'utf8',
    env: {
      ...process.env,
      CI: 'true',
      GITHUB_ACTIONS: 'true',
      GITHUB_EVENT_NAME: 'push',
      GITHUB_REF: 'refs/heads/master',
      GITHUB_REF_NAME: 'master',
      GITHUB_REPOSITORY: 'Arthird/design-designer',
      GITHUB_SHA: git(repo, 'rev-parse', 'HEAD'),
    },
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

  assert.equal(git(repo, 'tag', '--list', 'v1.0.1'), 'v1.0.1');
  assert.equal(git(repo, 'log', '-1', '--format=%s'), 'chore(release): 1.0.1 [skip ci]');
  const readme = fs.readFileSync(path.join(repo, 'README.md'), 'utf8');
  assert.match(readme, /<!-- VERSION:START -->\n\*\*Current version:\*\* v1\.0\.1\n<!-- VERSION:END -->/);
  for (const file of FILES.filter((name) => name.endsWith('README.md') || name === 'shared/VERSIONING.md' || name === 'shared/workflow/manual-verification.md')) {
    const text = fs.readFileSync(path.join(repo, file), 'utf8');
    assert.match(text, /v1\.0\.1/);
    assert.doesNotMatch(text, /v1\.0\.0/);
  }
  assert.equal(git(repo, 'status', '--porcelain'), '');
  assert.equal(git(repo, 'rev-list', '-n', '1', 'v1.0.1'), git(repo, 'rev-parse', 'HEAD'));

  const secondRun = spawnSync(path.join(ROOT, 'node_modules/.bin/semantic-release'), [], {
    cwd: repo,
    encoding: 'utf8',
    env: {
      ...process.env,
      CI: 'true',
      GITHUB_ACTIONS: 'true',
      GITHUB_EVENT_NAME: 'push',
      GITHUB_REF: 'refs/heads/master',
      GITHUB_REF_NAME: 'master',
      GITHUB_REPOSITORY: 'Arthird/design-designer',
      GITHUB_SHA: git(repo, 'rev-parse', 'HEAD'),
    },
  });
  assert.equal(secondRun.status, 0, `${secondRun.stdout}\n${secondRun.stderr}`);
  assert.equal(git(repo, 'status', '--porcelain'), '');
  assert.equal(git(repo, 'tag', '--list', 'v1.0.1'), 'v1.0.1');
  assert.equal(git(repo, 'log', '-1', '--format=%s'), 'chore(release): 1.0.1 [skip ci]');
  process.stdout.write('Release commit and tag integration passed.\n');
  fs.rmSync(root, { recursive: true, force: true });
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
