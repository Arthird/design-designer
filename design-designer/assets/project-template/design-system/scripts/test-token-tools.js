#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { validate } = require('./validate-tokens');
const { generateCss, renderFile } = require('./generate-css');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function expectFailure(doc, pattern, label) {
  try {
    validate(doc);
  } catch (error) {
    assert(pattern.test(error.message), `${label}: expected ${pattern}, received ${error.message}`);
    return;
  }
  throw new Error(`${label}: expected validation failure`);
}

function main() {
  const fixture = {
    color: {
      $type: 'color',
      primary: { $value: { colorSpace: 'srgb', components: [0, 0.4, 0.8], hex: '#0066cc' } },
      alias: { $value: '{color.primary}' },
      component: { $ref: '#/color/primary/$value/components/0', $type: 'number' }
    },
    size: { $type: 'dimension', medium: { $value: { value: 1, unit: 'rem' } } },
    font: { $type: 'fontFamily', sans: { $value: ['Inter', 'sans-serif'] } },
    effects: {
      $type: 'shadow',
      soft: {
        $value: [{ color: { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0.1 }, offsetX: { value: 0, unit: 'px' }, offsetY: { value: 1, unit: 'px' }, blur: { value: 2, unit: 'px' }, spread: { value: 0, unit: 'px' } }]
      }
    },
    text: {
      $type: 'typography',
      body: {
        $value: {
          fontFamily: '{font.sans}',
          fontSize: '{size.medium}',
          fontWeight: 400,
          letterSpacing: { value: 0, unit: 'px' },
          lineHeight: 1.5
        }
      }
    }
  };
  const result = validate(fixture);
  assert(result.tokens.length === 7, `Expected 7 tokens, received ${result.tokens.length}`);
  const css = renderFile(generateCss(fixture), '');
  assert(css === renderFile(generateCss(fixture), ''), 'Generation must be deterministic');
  assert(css.includes('--color-primary: #0066cc;'), 'Color generation missing');
  assert(css.includes('--color-component: 0;'), 'JSON Pointer property generation missing');
  const colorSpaces = validate({
    color: {
      $type: 'color',
      hsl: { $value: { colorSpace: 'hsl', components: [200, 50, 40] } },
      wide: { $value: { colorSpace: 'display-p3', components: [0.2, 0.4, 0.7], alpha: 0.8 } }
    }
  });
  assert(colorSpaces.tokens.length === 2, 'Color-space token validation unexpectedly failed');
  assert(css.includes('--effects-soft: 0px 1px 2px 0px rgb(0 0 0 / 0.1);'), 'Shadow array generation missing');

  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-token-tools-'));
  try {
    const first = path.join(temp, 'first.css');
    const second = path.join(temp, 'second.css');
    fs.writeFileSync(first, renderFile(generateCss(fixture), ''), 'utf8');
    fs.writeFileSync(second, renderFile(generateCss(fixture), ''), 'utf8');
    assert(fs.readFileSync(first, 'utf8') === fs.readFileSync(second, 'utf8'), 'Serialized generation must be deterministic');
  const escaped = {
    format: {
      $type: 'fontFamily',
      style: { $value: ['Font "Quoted"', 'sans-serif'] }
    }
  };
  const escapedCss = renderFile(generateCss(escaped), '');
  assert(escapedCss.includes('--format-style: "Font \\"Quoted\\"", sans-serif;'), 'CSS string escaping is not deterministic and valid');
  try {
    generateCss({
      gradient: {
        $type: 'gradient',
        stop: { $value: [{ color: { colorSpace: 'srgb', components: [0, 0, 0] }, position: 0 }] }
      }
    });
    throw new Error('gradient CSS mapping unexpectedly succeeded');
  } catch (error) {
    assert(/does not encode CSS gradient direction/.test(error.message), 'gradient rejection lacked an actionable message');
  }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }

  expectFailure({
    color: {
      $type: 'color',
      broken: { $value: { colorSpace: 'srgb', components: [2, 0, 0] } }
    }
  }, /above the supported range/, 'out-of-range color');
  expectFailure({
    size: { $type: 'dimension', broken: { $value: { value: 4, unit: 'em' } } }
  }, /unit must be px or rem/, 'unsupported dimension unit');
  expectFailure({
    a: { $type: 'number', $value: '{b}' },
    b: { $type: 'number', $value: '{a}' }
  }, /Circular/, 'circular alias');
  expectFailure({
    a: { $type: 'color', $value: '{missing.token}' }
  }, /Unresolved reference/, 'unresolved alias');
  expectFailure({
    a: { $type: 'color', $value: { colorSpace: 'not-a-space', components: [0, 0, 0] } }
  }, /Unsupported colorSpace/, 'unsupported color space');
  expectFailure({
    a: { $type: 'shadow', $value: { color: { colorSpace: 'srgb', components: [0, 0, 0] } } }
  }, /requires offsetX/, 'incomplete composite');
  expectFailure({
    'bad.name': { $type: 'number', $value: 1 }
  }, /braces or periods/, 'invalid token name');
  expectFailure({
    a: { $value: 1 }
  }, /type is not determinable/i, 'missing token type');
  expectFailure({
    a: { $type: 'number', $value: '{bad%escape}' }
  }, /Unresolved reference/, 'malformed pointer escape');
  expectFailure({
    base: { $type: 'number', root: { $value: 1 } },
    ref: { $ref: '#/base/root/$value', $type: 'string' }
  }, /does not match/, 'JSON Pointer type mismatch');
  const extended = {
    base: {
      $type: 'color',
      primary: { $value: { colorSpace: 'srgb', components: [0, 0, 0] } }
    },
    extended: {
      $extends: '{base}',
      secondary: { $value: { colorSpace: 'srgb', components: [1, 1, 1] } }
    }
  };
  const extendedResult = validate(extended);
  assert(extendedResult.tokens.some((token) => token.pathParts.join('.') === 'extended.primary'), 'Extended token was not inherited');
  const extendedCss = renderFile(generateCss(extended), '');
  assert(extendedCss.includes('--extended-primary: #000000;'), 'Extended token did not generate inherited CSS');
  const inheritedAlias = {
    base: { $type: 'number', value: { $value: 1 } },
    extended: { $extends: '{base}', alias: { $value: '{extended.value}' } }
  };
  validate(inheritedAlias);
  assert(generateCss(inheritedAlias).some(([property, value]) => property === '--extended-alias' && value === '1'), 'Inherited alias did not resolve');
  expectFailure({
    base: { $type: 'number', token: { $value: 1 } },
    extended: { $extends: '{base}', token: { $value: 2 } },
    bad: { $extends: '{extended}', token: { $value: false } }
  }, /Number token must be a finite JSON number/, 'conflicting extended token override');
  expectFailure({
    base: { $extends: '{extended}', value: { $type: 'number', $value: 1 } },
    extended: { $extends: '{base}', other: { $type: 'number', $value: 2 } }
  }, /Circular \$extends/, 'circular group extension');
  console.log('PASS: token tool fixture checks');
}

try {
  main();
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exit(1);
}
