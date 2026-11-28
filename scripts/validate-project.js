#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { fileURLToPath } = require('node:url');

const ROOT = path.resolve(__dirname, '..');
const errors = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.name === '.git' || entry.name === 'node_modules') return [];
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function validateSkill(file) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.startsWith('---\n')) errors.push(`${file}: missing YAML frontmatter`);
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) {
    errors.push(`${file}: missing closing YAML frontmatter`);
    return;
  }
  const frontmatter = text.slice(4, end);
  for (const field of ['name', 'description']) {
    if (!new RegExp(`^${field}:\\s*\\S`, 'm').test(frontmatter)) {
      errors.push(`${file}: frontmatter is missing ${field}`);
    }
  }
}

function validateLinks(file) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, '').split('#', 1)[0];
    if (!target) continue;
    const resolved = target.startsWith('file:')
      ? fileURLToPath(target)
      : /^[a-z][a-z\d+.-]*:/i.test(target)
        ? null
        : path.resolve(path.dirname(file), target);
    const externalAbsolute = resolved && path.isAbsolute(resolved) &&
      !resolved.startsWith(ROOT + path.sep) && !resolved.startsWith(os.tmpdir() + path.sep);
    if (resolved && !externalAbsolute && !fs.existsSync(resolved)) {
      errors.push(`${path.relative(ROOT, file)}: missing local link ${match[1]}`);
    }
  }
}

for (const skill of fs.globSync('skills/{working,knowledge}/*/SKILL.md', { cwd: ROOT })) {
  validateSkill(path.join(ROOT, skill));
}

for (const file of walk(ROOT).filter((item) => item.endsWith('.md'))) {
  validateLinks(file);
}

if (errors.length > 0) {
  process.stderr.write(`${errors.join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write('Skill frontmatter and local Markdown links passed.\n');
}
