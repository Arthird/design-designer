#!/usr/bin/env node
'use strict';

// Optional helper for documented color pairs. This does not determine whether
// the pair is normal text, large text, a UI component, or visually adjacent.

function parseHex(value) {
  if (typeof value !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(value)) throw new Error(`Expected a six-digit hex color, received ${value}`);
  return [0, 2, 4].map((offset) => parseInt(value.slice(1 + offset, 3 + offset), 16) / 255);
}

function relativeLuminance(hex) {
  const [r, g, b] = parseHex(hex).map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex) {
  return parseHex(hex).map((channel) => Math.round(channel * 255));
}

function rgbToOklch(hex) {
  const [red, green, blue] = parseHex(hex).map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  const l = 0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue;
  const m = 0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue;
  const s = 0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue;
  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);
  const lightness = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot;
  const a = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot;
  const b = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;
  const chroma = Math.hypot(a, b);
  let hue = Math.atan2(b, a) * 180 / Math.PI;
  if (hue < 0) hue += 360;
  return { lightness, chroma, hue };
}

function serializeColor(color) {
  if (color.colorSpace === 'srgb') {
    const [red, green, blue] = color.components;
    const alpha = color.alpha === undefined ? 1 : color.alpha;
    return alpha === 1
      ? `#${color.components.map((value) => Math.round(value * 255).toString(16).padStart(2, '0')).join('')}`
      : `rgb(${color.components.map((value) => Math.round(value * 255)).join(' ')} / ${alpha})`;
  }
  if (color.colorSpace === 'display-p3') {
    const alpha = color.alpha === undefined ? 1 : color.alpha;
    return `color(display-p3 ${color.components.join(' ')}${alpha === 1 ? '' : ` / ${alpha}`})`;
  }
  if (color.colorSpace === 'hsl') {
    return `hsl(${color.components[0]} ${color.components[1]}% ${color.components[2]}%${color.alpha === undefined || color.alpha === 1 ? '' : ` / ${color.alpha}`})`;
  }
  if (color.colorSpace === 'hwb') {
    return `hwb(${color.components[0]} ${color.components[1]}% ${color.components[2]}%${color.alpha === undefined || color.alpha === 1 ? '' : ` / ${color.alpha}`})`;
  }
  if (color.colorSpace === 'lch') {
    return `lch(${color.components[0]}% ${color.components[1]} ${color.components[2]}${color.alpha === undefined || color.alpha === 1 ? '' : ` / ${color.alpha}`})`;
  }
  if (color.colorSpace === 'oklch') {
    return `oklch(${color.components[0]} ${color.components[1]} ${color.components[2]}${color.alpha === undefined || color.alpha === 1 ? '' : ` / ${color.alpha}`})`;
  }
  if (color.colorSpace === 'lab') {
    return `lab(${color.components[0]}% ${color.components[1]} ${color.components[2]}${color.alpha === undefined || color.alpha === 1 ? '' : ` / ${color.alpha}`})`;
  }
  if (color.colorSpace === 'oklab') {
    return `oklab(${color.components[0]} ${color.components[1]} ${color.components[2]}${color.alpha === undefined || color.alpha === 1 ? '' : ` / ${color.alpha}`})`;
  }
  if (['a98-rgb', 'prophoto-rgb', 'rec2020'].includes(color.colorSpace)) {
    return `color(${color.colorSpace} ${color.components.join(' ')}${color.alpha === undefined || color.alpha === 1 ? '' : ` / ${color.alpha}`})`;
  }
  if (color.colorSpace === 'xyz-d65' || color.colorSpace === 'xyz-d50') {
    return `color(${color.colorSpace} ${color.components.join(' ')}${color.alpha === undefined || color.alpha === 1 ? '' : ` / ${color.alpha}`})`;
  }
  throw new Error(`Cannot serialize unsupported color space ${color.colorSpace}`);
}

function contrastRatio(foreground, background) {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

if (require.main === module) {
  const [foreground, background] = process.argv.slice(2);
  try {
    const ratio = contrastRatio(foreground, background);
    console.log(`${ratio.toFixed(2)}:1 (${foreground} on ${background})`);
    console.log('Manual review still required: select the applicable WCAG criterion for the text/component role and state.');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { parseHex, hexToRgb, rgbToOklch, serializeColor, relativeLuminance, contrastRatio };
