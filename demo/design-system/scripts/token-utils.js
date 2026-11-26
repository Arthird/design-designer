'use strict';

const KNOWN_TYPES = new Set([
  'color', 'dimension', 'fontFamily', 'fontWeight', 'duration', 'cubicBezier',
  'number', 'strokeStyle', 'border', 'transition', 'shadow', 'gradient',
  'typography',
]);

const STRICT_FORMAT_TYPES = new Set([
  'color', 'dimension', 'fontFamily', 'fontWeight', 'duration', 'cubicBezier',
  'number', 'strokeStyle', 'border', 'transition', 'shadow', 'gradient',
  'typography',
]);

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isToken(value) {
  return isObject(value) && Object.prototype.hasOwnProperty.call(value, '$value');
}

function isReferenceToken(value) {
  return isObject(value) && typeof value.$ref === 'string' && !Object.prototype.hasOwnProperty.call(value, '$value');
}

function isExtensionReferencingToken(value) {
  return isObject(value) && Object.prototype.hasOwnProperty.call(value, '$extends') && !isToken(value) && !isReferenceToken(value);
}

function fail(message, path = '') {
  const error = new Error(path ? `${path}: ${message}` : message);
  error.isTokenValidationError = true;
  throw error;
}

function pointerDecode(segment) {
  return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}

function pointerEscape(segment) {
  return String(segment).replace(/~/g, '~0').replace(/\//g, '~1');
}

function pointerGet(doc, pointer) {
  if (pointer === '#') return doc;
  if (!pointer.startsWith('#/')) return undefined;
  let current = doc;
  for (const raw of pointer.slice(2).split('/')) {
    let key;
    try {
      key = decodeURIComponent(pointerDecode(raw));
    } catch {
      return undefined;
    }
    if (Array.isArray(current)) {
      if (!/^(?:0|[1-9][0-9]*)$/.test(key)) return undefined;
      const index = Number(key);
      if (index >= current.length) return undefined;
      current = current[index];
      continue;
    }
    if (!isObject(current) || !Object.prototype.hasOwnProperty.call(current, key)) return undefined;
    current = current[key];
  }
  return current;
}

function pointerForPath(rootPath, suffix = []) {
  return `#/${[...rootPath, ...suffix].map(pointerEscape).join('/')}`;
}

function parseReference(text, doc) {
  if (typeof text !== 'string') return null;
  const curly = text.match(/^\{([^{}]+)\}$/);
  if (curly) {
    const p = curly[1];
    const target = pointerGet(doc, pointerForPath(p.split('.')));
    return { text, target, pointer: pointerForPath(p.split('.')), kind: 'curly' };
  }
  if (text.startsWith('#/') || text === '#') {
    return { text, target: pointerGet(doc, text), pointer: text, kind: 'pointer' };
  }
  return null;
}

function tokenFromPointer(doc, pointer) {
  if (typeof pointer !== 'string' || !pointer.startsWith('#/')) return undefined;
  const segments = pointer.slice(2).split('/').map(pointerDecode);
  const valueIndex = segments.lastIndexOf('$value');
  if (valueIndex < 1) return undefined;
  const tokenPointer = `#/${segments.slice(0, valueIndex).map(pointerEscape).join('/')}`;
  const token = pointerGet(doc, tokenPointer);
  return isToken(token) ? { token, pointer: tokenPointer } : undefined;
}

function walkEntries(doc) {
  const entries = [];
  function visit(node, pathParts, inheritedType) {
    if (!isObject(node)) return;
    const ownType = definitionType(node, inheritedType);
    entries.push({ node, pathParts, inheritedType: ownType });
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      visit(child, [...pathParts, key], ownType);
    }
  }
  visit(doc, [], undefined);
  return entries;
}

function definitionType(node, inheritedType) {
  if (isObject(node) && typeof node.$type === 'string') return node.$type;
  return inheritedType;
}

function collectTokens(doc, options = {}) {
  const { resolveExtensions = false } = options;
  const tokens = [];
  function visit(node, pathParts, inheritedType) {
    if (!isObject(node)) return;
    let effectiveNode = node;
    if (resolveExtensions && typeof node.$extends === 'string') {
      effectiveNode = resolveExtends(doc, node, tokenKey(pathParts));
    }
    if (isToken(effectiveNode) || isReferenceToken(effectiveNode)) {
      tokens.push({ node: effectiveNode, pathParts, inheritedType });
      return;
    }
    const currentType = definitionType(effectiveNode, inheritedType);
    for (const [key, child] of Object.entries(effectiveNode)) {
      if (key.startsWith('$')) continue;
      visit(child, [...pathParts, key], currentType);
    }
  }
  visit(doc, [], undefined);
  return tokens;
}

function findEffectiveToken(doc, path, originalDoc = doc) {
  const parts = Array.isArray(path) ? path : String(path).split('.');
  if (parts[0] === '') parts.shift();
  const pointer = pointerForPath(parts);
  const direct = pointerGet(originalDoc, pointer);
  if (isToken(direct) || isReferenceToken(direct)) return direct;
  const inherited = collectTokens(doc, { resolveExtensions: true }).find((token) => tokenKey(token.pathParts) === parts.join('.'));
  return inherited ? inherited.node : undefined;
}

function effectiveTokenAtPointer(doc, pointer) {
  const direct = pointerGet(doc, pointer);
  if (isToken(direct) || isReferenceToken(direct)) return direct;
  const parts = pointer.slice(2).split('/').map(pointerDecode);
  const effective = findEffectiveToken(doc, parts);
  return effective;
}

function effectiveTokenPointer(doc, pathOrPointer) {
  if (typeof pathOrPointer === 'string' && pathOrPointer.startsWith('#/')) {
    const direct = pointerGet(doc, pathOrPointer);
    if (isToken(direct) || isReferenceToken(direct)) return pathOrPointer;
    return pathOrPointer;
  }
  return pathOrPointer;
}

function collectGroups(doc) {
  const groups = [];
  function visit(node, pathParts, inheritedType) {
    if (!isObject(node) || isToken(node) || isReferenceToken(node)) return;
    const currentType = definitionType(node, inheritedType);
    groups.push({ node, pathParts, inheritedType: currentType });
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      visit(child, [...pathParts, key], currentType);
    }
  }
  visit(doc, [], undefined);
  return groups;
}

function tokenKey(pathParts) {
  return pathParts.join('.');
}

function referencePath(reference) {
  return reference && reference.pointer ? reference.pointer.slice(2).split('/').map(pointerDecode) : [];
}

function referenceValue(doc, reference) {
  if (!reference || reference.target === undefined) return undefined;
  if (reference.kind === 'curly') {
    if (isToken(reference.target)) return reference.target.$value;
    const effective = findEffectiveToken(doc, referencePath(reference));
    return effective ? effective.$value : undefined;
  }
  if (reference.pointer.endsWith('/$value')) return reference.target;
  return reference.target;
}

function validateNames(doc) {
  function visit(node, pathParts, isRoot) {
    if (!isObject(node)) fail('Expected an object.', pathParts.join('.') || '<root>');
    if (isToken(node) || isReferenceToken(node)) {
      const childKeys = Object.keys(node).filter((key) => !key.startsWith('$'));
      if (childKeys.length > 0) fail(`Token cannot also contain child keys: ${childKeys.join(', ')}.`, pathParts.join('.'));
    } else {
      for (const key of Object.keys(node)) {
        if (key.startsWith('$') && !['$extensions', '$description', '$deprecated', '$type', '$extends'].includes(key)) {
          // Unknown $-properties are reserved and should not be mistaken for child names.
          fail(`Unsupported group property "${key}".`, pathParts.join('.') || '<root>');
        }
      }
    }
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$') && !(key === '$root' && (isToken(child) || isReferenceToken(child)))) continue;
      if (key !== '$root' && key.startsWith('$')) fail(`Name must not begin with "$": ${key}.`, pathParts.join('.') || '<root>');
      if (/[{}.]/.test(key)) fail(`Name must not contain braces or periods: ${key}.`, pathParts.join('.') || '<root>');
      if (!isObject(child)) fail('Group and token values must be JSON objects.', [...pathParts, key].join('.'));
      visit(child, [...pathParts, key], false);
    }
  }
  visit(doc, [], true);
}

function asDimension(value, path) {
  if (!isObject(value)) fail('Dimension must be an object with value and unit.', path);
  if (typeof value.value !== 'number' || !Number.isFinite(value.value)) fail('Dimension value must be a finite number.', path);
  if (!['px', 'rem'].includes(value.unit)) fail('Dimension unit must be px or rem.', path);
  const keys = Object.keys(value);
  if (keys.some((key) => key !== 'value' && key !== 'unit')) fail('Dimension has unsupported keys.', path);
  return value;
}

function asDuration(value, path) {
  if (!isObject(value)) fail('Duration must be an object with value and unit.', path);
  if (typeof value.value !== 'number' || !Number.isFinite(value.value)) fail('Duration value must be a finite number.', path);
  if (!['ms', 's'].includes(value.unit)) fail('Duration unit must be ms or s.', path);
  return value;
}

function validateColorSpace(space, components, path) {
  const spaces = {
    'srgb': { count: 3, min: 0, max: 1 },
    'srgb-linear': { count: 3, min: 0, max: 1 },
    'hsl': { count: 3, min: [0, 0, 0], max: [360, 100, 100], exclusiveMax: [0] },
    'hwb': { count: 3, min: [0, 0, 0], max: [360, 100, 100], exclusiveMax: [0] },
    'lab': { count: 3 },
    'lch': { count: 3, min: [0, 0, -Infinity], max: [100, Infinity, 360], exclusiveMax: [2] },
    'oklab': { count: 3 },
    'oklch': { count: 3, min: [0, 0, -Infinity], max: [1, Infinity, 360], exclusiveMax: [2] },
    'display-p3': { count: 3, min: 0, max: 1 },
    'a98-rgb': { count: 3, min: 0, max: 1 },
    'prophoto-rgb': { count: 3, min: 0, max: 1 },
    'rec2020': { count: 3, min: 0, max: 1 },
    'xyz-d65': { count: 3, min: 0, max: 1 },
    'xyz-d50': { count: 3, min: 0, max: 1 },
  };
  const spec = spaces[space];
  if (!spec) fail(`Unsupported colorSpace "${space}".`, path);
  if (!Array.isArray(components) || components.length !== spec.count) fail(`Color components must contain ${spec.count} values for ${space}.`, path);
  components.forEach((component, index) => {
    if (component === 'none') return;
    if (typeof component !== 'number' || !Number.isFinite(component)) fail(`Color component ${index} must be a finite number or "none".`, path);
    const min = Array.isArray(spec.min) ? spec.min[index] : spec.min;
    const max = Array.isArray(spec.max) ? spec.max[index] : spec.max;
    if (min !== undefined && component < min) fail(`Color component ${index} is below the supported range.`, path);
    if (max !== undefined && component > max) fail(`Color component ${index} is above the supported range.`, path);
    if (spec.exclusiveMax && spec.exclusiveMax.includes(index) && component >= max) fail(`Color component ${index} must be below ${max}.`, path);
  });
}

function validateColor(value, path) {
  if (!isObject(value)) fail('Color must be an object.', path);
  if (typeof value.colorSpace !== 'string') fail('Color requires colorSpace.', path);
  if (!Array.isArray(value.components)) fail('Color requires components.', path);
  validateColorSpace(value.colorSpace, value.components, path);
  const allowed = new Set(['colorSpace', 'components', 'alpha', 'hex']);
  for (const key of Object.keys(value)) if (!allowed.has(key)) fail(`Color has unsupported key "${key}".`, path);
  if (Object.prototype.hasOwnProperty.call(value, 'alpha')) {
    if (typeof value.alpha !== 'number' || !Number.isFinite(value.alpha) || value.alpha < 0 || value.alpha > 1) fail('Color alpha must be between 0 and 1.', path);
  }
  if (Object.prototype.hasOwnProperty.call(value, 'hex') && !/^#[0-9a-fA-F]{6}$/.test(value.hex)) fail('Color hex fallback must have six hex digits.', path);
}

const FONT_WEIGHT_ALIASES = new Set(['thin', 'hairline', 'extra-light', 'ultra-light', 'light', 'normal', 'regular', 'book', 'medium', 'semi-bold', 'demi-bold', 'bold', 'extra-bold', 'ultra-bold', 'black', 'heavy', 'extra-black', 'ultra-black']);
const STROKE_STYLES = new Set(['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'outset', 'inset']);
const LINE_CAPS = new Set(['round', 'butt', 'square']);

function validatePrimitive(type, value, path) {
  switch (type) {
    case 'color':
      validateColor(value, path);
      break;
    case 'dimension':
      asDimension(value, path);
      break;
    case 'fontFamily':
      if (typeof value === 'string' && value.trim()) break;
      if (Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string' && item.trim())) break;
      fail('Font family must be a non-empty string or array of names.', path);
      break;
    case 'fontWeight':
      if (typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 1000) break;
      if (typeof value === 'string' && FONT_WEIGHT_ALIASES.has(value)) break;
      fail('Font weight must be a number from 1 to 1000 or a defined string alias.', path);
      break;
    case 'duration':
      asDuration(value, path);
      break;
    case 'cubicBezier':
      if (!Array.isArray(value) || value.length !== 4 || value.some((item) => typeof item !== 'number' || !Number.isFinite(item))) fail('Cubic Bezier must contain four finite numbers.', path);
      if (value[0] < 0 || value[0] > 1 || value[2] < 0 || value[2] > 1) fail('Cubic Bezier x coordinates must be between 0 and 1.', path);
      break;
    case 'number':
      if (typeof value !== 'number' || !Number.isFinite(value)) fail('Number token must be a finite JSON number.', path);
      break;
    case 'string':
      fail('The pinned 2025.10 type list does not define a normative "string" token type. Use a supported format type or document a project extension.', path);
      break;
    default:
      return false;
  }
  return true;
}

function validateReferenceOrValue(doc, expectedType, value, path, resolving = new Set()) {
  if (isReferenceToken(value)) {
    const targetType = resolveRefType(doc, value.$ref, resolving);
    if (expectedType && targetType !== expectedType) fail(`$ref ${value.$ref} resolves to ${targetType}, expected ${expectedType}.`, path);
    return;
  }
  if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('#/'))) {
    const reference = parseReference(value, doc);
    const effective = reference && reference.kind === 'curly' ? findEffectiveToken(doc, reference.pointer.slice(2).split('/').map(pointerDecode)) : undefined;
    if (!reference || (reference.target === undefined && !effective)) fail(`Unresolved reference ${value}.`, path);
    const targetType = reference.kind === 'curly'
      ? (effective ? resolveTokenType(doc, effective, reference.pointer, resolving) : fail(`Reference ${value} must target a complete token, not a group or scalar.`, path))
      : resolveRefType(doc, reference.pointer, resolving);
    if (expectedType && targetType !== expectedType) fail(`Reference ${value} resolves to ${targetType}, expected ${expectedType}.`, path);
    return;
  }
  if (expectedType === 'boolean') {
    if (typeof value !== 'boolean') fail('Boolean value expected.', path);
    return;
  }
  validatePrimitive(expectedType, value, path);
}

function validateStrokeStyle(doc, value, path, resolving) {
  if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('#/'))) {
    validateReferenceOrValue(doc, 'strokeStyle', value, path, resolving);
    return;
  }
  if (typeof value === 'string') {
    if (!STROKE_STYLES.has(value)) fail(`Unsupported stroke style "${value}".`, path);
    return;
  }
  if (!isObject(value)) fail('Stroke style must be a string or object.', path);
  const keys = Object.keys(value).sort().join(',');
  if (keys !== 'dashArray,lineCap') fail('Stroke style object requires exactly dashArray and lineCap.', path);
  if (!Array.isArray(value.dashArray) || value.dashArray.length === 0) fail('strokeStyle dashArray must be a non-empty array.', path);
  value.dashArray.forEach((item, index) => validateReferenceOrValue(doc, 'dimension', item, `${path}.dashArray[${index}]`, resolving));
  if (!LINE_CAPS.has(value.lineCap)) fail('strokeStyle lineCap must be round, butt, or square.', path);
}

function validateBorder(doc, value, path, resolving) {
  if (!isObject(value)) fail('Border must be an object.', path);
  const keys = Object.keys(value).sort().join(',');
  if (keys !== 'color,style,width') fail('Border requires color, width, and style.', path);
  validateReferenceOrValue(doc, 'color', value.color, `${path}.color`, resolving);
  validateReferenceOrValue(doc, 'dimension', value.width, `${path}.width`, resolving);
  validateStrokeStyle(doc, value.style, `${path}.style`, resolving);
}

function validateTransition(doc, value, path, resolving) {
  if (!isObject(value)) fail('Transition must be an object.', path);
  const keys = Object.keys(value).sort().join(',');
  if (keys !== 'delay,duration,timingFunction') fail('Transition requires duration, delay, and timingFunction.', path);
  validateReferenceOrValue(doc, 'duration', value.duration, `${path}.duration`, resolving);
  validateReferenceOrValue(doc, 'duration', value.delay, `${path}.delay`, resolving);
  validateReferenceOrValue(doc, 'cubicBezier', value.timingFunction, `${path}.timingFunction`, resolving);
}

function validateShadowObject(doc, value, path, resolving) {
  if (!isObject(value)) fail('Shadow must be an object.', path);
  const allowed = new Set(['color', 'offsetX', 'offsetY', 'blur', 'spread', 'inset']);
  for (const key of ['color', 'offsetX', 'offsetY', 'blur', 'spread']) if (!Object.prototype.hasOwnProperty.call(value, key)) fail(`Shadow requires ${key}.`, path);
  for (const key of Object.keys(value)) if (!allowed.has(key)) fail(`Shadow has unsupported key "${key}".`, path);
  validateReferenceOrValue(doc, 'color', value.color, `${path}.color`, resolving);
  for (const key of ['offsetX', 'offsetY', 'blur', 'spread']) validateReferenceOrValue(doc, 'dimension', value[key], `${path}.${key}`, resolving);
  if (Object.prototype.hasOwnProperty.call(value, 'inset') && typeof value.inset !== 'boolean') fail('Shadow inset must be boolean.', path);
}

function validateShadow(doc, value, path, resolving) {
  if (Array.isArray(value)) {
    if (value.length === 0) fail('Shadow array must not be empty.', path);
    value.forEach((item, index) => {
      if (typeof item === 'string') validateReferenceOrValue(doc, 'shadow', item, `${path}[${index}]`, resolving);
      else validateShadowObject(doc, item, `${path}[${index}]`, resolving);
    });
  } else {
    validateShadowObject(doc, value, path, resolving);
  }
}

function validateGradient(doc, value, path, resolving) {
  if (!Array.isArray(value) || value.length === 0) fail('Gradient must be a non-empty array.', path);
  value.forEach((stop, index) => {
    if (typeof stop === 'string') {
      validateReferenceOrValue(doc, 'gradient', stop, `${path}[${index}]`, resolving);
      return;
    }
    if (!isObject(stop)) fail('Gradient stop must be an object or reference.', `${path}[${index}]`);
    const keys = Object.keys(stop).sort().join(',');
    if (keys !== 'color,position') fail('Gradient stop requires color and position.', `${path}[${index}]`);
    validateReferenceOrValue(doc, 'color', stop.color, `${path}[${index}].color`, resolving);
    validateReferenceOrValue(doc, 'number', stop.position, `${path}[${index}].position`, resolving);
  });
}

function validateTypography(doc, value, path, resolving) {
  if (!isObject(value)) fail('Typography must be an object.', path);
  const keys = Object.keys(value).sort().join(',');
  if (keys !== 'fontFamily,fontSize,fontWeight,letterSpacing,lineHeight') fail('Typography requires fontFamily, fontSize, fontWeight, letterSpacing, and lineHeight.', path);
  validateReferenceOrValue(doc, 'fontFamily', value.fontFamily, `${path}.fontFamily`, resolving);
  validateReferenceOrValue(doc, 'dimension', value.fontSize, `${path}.fontSize`, resolving);
  validateReferenceOrValue(doc, 'fontWeight', value.fontWeight, `${path}.fontWeight`, resolving);
  validateReferenceOrValue(doc, 'dimension', value.letterSpacing, `${path}.letterSpacing`, resolving);
  validateReferenceOrValue(doc, 'number', value.lineHeight, `${path}.lineHeight`, resolving);
}

function resolveTokenType(doc, token, pointer, resolving = new Set()) {
  if (resolving.has(pointer)) fail(`Circular type reference at ${pointer}.`, pointer);
  if (typeof token.$type === 'string') return token.$type;
  if (typeof token.$value === 'string') {
    const reference = parseReference(token.$value, doc);
    if (reference) {
      const effective = reference.kind === 'curly' ? effectiveTokenAtPointer(doc, reference.pointer) : undefined;
      if (reference.target === undefined && !effective) fail(`Unresolved reference ${token.$value}.`, pointer);
      if (!effective && !isToken(reference.target)) fail(`Reference ${token.$value} must target a token.`, pointer);
      const next = new Set(resolving).add(pointer);
      const targetPointer = effective ? effectiveTokenPointer(doc, reference.pointer) : reference.pointer;
      return resolveTokenType(doc, effective || reference.target, targetPointer, next);
    }
  }
  return inheritedTypeAtPointer(doc, pointer);
}

function validateAliasCycles(doc) {
  const tokens = collectTokens(doc);
  const tokenPointers = new Set(tokens.map((token) => pointerForPath(token.pathParts)));
  const finished = new Set();
  for (const token of tokens) {
    const start = pointerForPath(token.pathParts);
    if (finished.has(start)) continue;
    const stack = [];
    let current = token;
    let pointer = start;
    while (current) {
      if (stack.includes(pointer)) fail(`Circular reference ${[...stack, pointer].join(' -> ')}.`, pointer);
      stack.push(pointer);
      if (isReferenceToken(current.node)) break;
      if (typeof current.node.$value !== 'string') break;
      const reference = parseReference(current.node.$value, doc);
      if (!reference || !tokenPointers.has(reference.pointer)) break;
      pointer = reference.pointer;
      current = tokens.find((candidate) => pointerForPath(candidate.pathParts) === pointer);
    }
    for (const item of stack) finished.add(item);
  }
}

function inheritedTypeAtPointer(doc, pointer) {
  let node = doc;
  let inherited;
  if (typeof pointer !== 'string' || !pointer.startsWith('#/')) return undefined;
  for (const raw of pointer.slice(2).split('/')) {
    const key = pointerDecode(raw);
    if (node && typeof node.$extends === 'string') {
      const extensionTarget = pointerGet(doc, node.$extends.startsWith('#/') ? node.$extends : pointerForPath(node.$extends.replace(/^\{|\}$/g, '').split('.')));
      if (isObject(extensionTarget) && typeof extensionTarget.$type === 'string' && !inherited) inherited = extensionTarget.$type;
    }
    if (!isObject(node)) return undefined;
    if (typeof node.$type === 'string') inherited = node.$type;
    node = node[key];
  }
  return inherited;
}

function mergeObjects(base, local) {
  const result = { ...base };
  for (const [key, value] of Object.entries(local)) {
    if (isObject(result[key]) && isObject(value) && !key.startsWith('$')) result[key] = mergeObjects(result[key], value);
    else result[key] = value;
  }
  return result;
}

function resolveExtends(doc, group, path, stack = []) {
  if (!isObject(group) || typeof group.$extends !== 'string') return group;
  if (group.$extends.startsWith('#/')) {
    const target = pointerGet(doc, group.$extends);
    if (target === undefined) fail(`Unresolved $extends reference ${group.$extends}.`, path);
    if (isToken(target) || isReferenceToken(target)) fail('$extends must reference a group, not a token.', path);
    if (stack.includes(group.$extends)) fail('Circular $extends reference.', path);
    const base = resolveExtends(doc, target, group.$extends, [...stack, group.$extends]);
    const local = { ...group };
    delete local.$extends;
    return mergeObjects(base, local);
  }
  const reference = parseReference(group.$extends, doc);
  if (!reference || reference.target === undefined) fail(`Unresolved $extends reference ${group.$extends}.`, path);
  if (isToken(reference.target)) fail('$extends must reference a group, not a token.', path);
  if (stack.includes(reference.pointer)) fail('Circular $extends reference.', path);
  const base = resolveExtends(doc, reference.target, reference.pointer, [...stack, reference.pointer]);
  const local = { ...group };
  delete local.$extends;
  return mergeObjects(base, local);
}

function validateTypeValue(doc, type, value, path, resolving) {
  if (validatePrimitive(type, value, path)) return;
  switch (type) {
    case 'strokeStyle': validateStrokeStyle(doc, value, path, resolving); break;
    case 'border': validateBorder(doc, value, path, resolving); break;
    case 'transition': validateTransition(doc, value, path, resolving); break;
    case 'shadow': validateShadow(doc, value, path, resolving); break;
    case 'gradient': validateGradient(doc, value, path, resolving); break;
    case 'typography': validateTypography(doc, value, path, resolving); break;
    default: fail(`Unsupported token type "${type}".`, path);
  }
}

function validateTokens(doc) {
  if (!isObject(doc)) fail('Design token document must be a JSON object.');
  validateNames(doc);
  const groups = collectGroups(doc);
  const groupPointers = new Set(groups.map((group) => pointerForPath(group.pathParts)));
  for (const group of groups) {
    if (group.node.$extends !== undefined) {
      if (typeof group.node.$extends !== 'string') fail('$extends must be a string reference.', tokenKey(group.pathParts));
      if (group.node.$extends.startsWith('#/')) {
        const target = pointerGet(doc, group.node.$extends);
        if (target === undefined) fail(`Unresolved $extends reference ${group.node.$extends}.`, tokenKey(group.pathParts));
        if (isToken(target) || isReferenceToken(target)) fail('$extends must target a group.', tokenKey(group.pathParts));
      } else {
        const reference = parseReference(group.node.$extends, doc);
        if (!reference || reference.target === undefined) fail(`Unresolved $extends reference ${group.node.$extends}.`, tokenKey(group.pathParts));
        if (!groupPointers.has(reference.pointer)) fail('$extends must target a group.', tokenKey(group.pathParts));
      }
      resolveExtends(doc, group.node, tokenKey(group.pathParts));
    }
  }
  const resolvedGroups = new Set();
  const resolveGroupChain = (group, chain = []) => {
    const pointer = pointerForPath(group.pathParts);
    if (resolvedGroups.has(pointer)) return;
    if (!group.node.$extends) {
      resolvedGroups.add(pointer);
      return;
    }
    if (chain.includes(pointer)) fail('Circular $extends reference.', pointer);
    const target = pointerGet(doc, group.node.$extends.startsWith('#/')
      ? group.node.$extends
      : pointerForPath(group.node.$extends.replace(/^\{|\}$/g, '').split('.')));
    const parent = groups.find((candidate) => pointerGet(doc, pointerForPath(candidate.pathParts)) === target);
    if (parent) resolveGroupChain(parent, [...chain, pointer]);
    resolvedGroups.add(pointer);
  };
  for (const group of groups) resolveGroupChain(group);
  const tokens = collectTokens(doc, { resolveExtensions: true });
  if (tokens.length === 0) fail('Token document contains no tokens.');
  validateAliasCycles(doc);
  for (const token of tokens) {
    const path = tokenKey(token.pathParts);
    const pointer = pointerForPath(token.pathParts);
    const explicitType = token.node.$type;
    let type = token.inheritedType;
    if (explicitType !== undefined) {
      if (typeof explicitType !== 'string') fail('$type must be a string.', path);
      type = explicitType;
    }
    if (isReferenceToken(token.node)) {
      if (typeof token.node.$ref !== 'string' || !token.node.$ref.startsWith('#/')) fail('$ref must be a JSON Pointer reference beginning with #/.', path);
      const target = pointerGet(doc, token.node.$ref);
      if (target === undefined) fail(`Unresolved $ref ${token.node.$ref}.`, path);
      const refType = resolveRefType(doc, token.node.$ref, new Set([pointer]));
      if (type === undefined) type = refType;
      else if (refType !== type) fail(`$ref target type ${refType} does not match token type ${type}.`, path);
    } else if (typeof token.node.$value === 'string') {
      const reference = parseReference(token.node.$value, doc);
      if (reference) {
        const effective = reference.kind === 'curly' ? effectiveTokenAtPointer(doc, reference.pointer) : undefined;
        if (reference.target === undefined && !effective) fail(`Unresolved reference ${token.node.$value}.`, path);
        if (!effective && !isToken(reference.target)) fail(`Reference ${token.node.$value} must target a complete token.`, path);
        type = resolveTokenType(doc, token.node, pointer);
      }
    }
    if (!type) fail('Token type is not determinable. Set $type, inherit it from a group, or reference a typed value with a declared type.', path);
    if (!STRICT_FORMAT_TYPES.has(type)) fail(`Type "${type}" is not in the core 2025.10 type set supported by this validator.`, path);
    if (isReferenceToken(token.node)) {
      // A $ref may target a property rather than a complete token; its type is checked above.
      validateTypedTree(doc, type, pointerGet(doc, token.node.$ref), path, new Set([pointer]));
    } else {
      const alias = typeof token.node.$value === 'string' ? parseReference(token.node.$value, doc) : null;
      if (alias) {
      const effective = alias.kind === 'curly' ? findEffectiveToken(doc, alias.pointer.slice(2).split('/').map(pointerDecode)) : undefined;
      if (alias.target === undefined && !effective) fail(`Unresolved reference ${token.node.$value}.`, path);
      if (!effective && !isToken(alias.target)) fail(`Reference ${token.node.$value} must target a complete token.`, path);
      const targetType = effective ? resolveTokenType(doc, effective, alias.pointer) : resolveTokenType(doc, alias.target, alias.pointer);
      if (targetType !== type) fail(`Alias type ${targetType} does not match declared/resolved type ${type}.`, path);
      } else {
        validateTypeValue(doc, type, token.node.$value, path, new Set([pointer]));
      }
    }
    if (token.node.$description !== undefined && typeof token.node.$description !== 'string') fail('$description must be a string.', path);
    if (token.node.$deprecated !== undefined && typeof token.node.$deprecated !== 'boolean' && typeof token.node.$deprecated !== 'string') fail('$deprecated must be boolean or string.', path);
    const allowedTokenKeys = new Set(['$type', '$value', '$ref', '$description', '$extensions', '$deprecated']);
    for (const key of Object.keys(token.node)) if (key.startsWith('$') && !allowedTokenKeys.has(key)) fail(`Unsupported token property "${key}".`, path);
  }
  return { tokens, groups };
}

function resolveRefType(doc, pointer, resolving = new Set()) {
  if (resolving.has(pointer)) fail(`Circular $ref at ${pointer}.`, pointer);
  const segments = pointer.slice(2).split('/').map(pointerDecode);
  const valueIndex = segments.lastIndexOf('$value');
  if (valueIndex > 0 && valueIndex < segments.length - 1) {
    const property = segments[valueIndex + 1];
    const owner = tokenFromPointer(doc, pointer);
    const ownerType = owner ? resolveTokenType(doc, owner.token, owner.pointer, resolving) : undefined;
    const pathWithinValue = segments.slice(valueIndex + 1);
    const leafType = inferValuePathType(ownerType, pathWithinValue);
    if (leafType) return leafType;
  }
  const value = pointerGet(doc, pointer);
  if (value === undefined) fail(`Unresolved $ref ${pointer}.`, pointer);
  if (isObject(value) && typeof value.$type === 'string') return value.$type;
  if (isObject(value) && typeof value.$ref === 'string') return resolveRefType(doc, value.$ref, new Set(resolving).add(pointer));

  // For property-level references, derive the type from the token containing the property.
  for (let length = segments.length - 1; length >= 1; length -= 1) {
    const candidate = pointerGet(doc, `#/${segments.slice(0, length).map(pointerEscape).join('/')}`);
    if (isToken(candidate)) {
      const candidatePointer = `#/${segments.slice(0, length).map(pointerEscape).join('/')}`;
      return resolveTokenType(doc, candidate, candidatePointer);
    }
  }
  fail(`Cannot determine the type of $ref target ${pointer}; declare $type on the referencing token.`, pointer);
}

function inferValuePathType(ownerType, pathWithinValue) {
  if (!ownerType) return undefined;
  if (ownerType === 'color') {
    if (pathWithinValue[0] === 'components') return pathWithinValue.length === 1 ? 'number[]' : 'number';
    if (pathWithinValue[0] === 'alpha') return 'number';
    if (pathWithinValue[0] === 'hex') return 'string';
  }
  if (ownerType === 'dimension' || ownerType === 'duration') {
    if (pathWithinValue[0] === 'value') return 'number';
    if (pathWithinValue[0] === 'unit') return 'string';
  }
  if (ownerType === 'cubicBezier' && pathWithinValue.length === 1 && /^(?:0|1|2|3)$/.test(pathWithinValue[0])) return 'number';
  if (ownerType === 'shadow') {
    if (pathWithinValue[0] === 'color') return pathWithinValue.length === 1 ? 'color' : inferValuePathType('color', pathWithinValue.slice(1));
    if (['offsetX', 'offsetY', 'blur', 'spread'].includes(pathWithinValue[0])) return pathWithinValue.length === 1 ? 'dimension' : inferValuePathType('dimension', pathWithinValue.slice(1));
    if (pathWithinValue[0] === 'inset') return 'boolean';
  }
  if (ownerType === 'border') {
    if (pathWithinValue[0] === 'color') return pathWithinValue.length === 1 ? 'color' : inferValuePathType('color', pathWithinValue.slice(1));
    if (pathWithinValue[0] === 'width') return pathWithinValue.length === 1 ? 'dimension' : inferValuePathType('dimension', pathWithinValue.slice(1));
    if (pathWithinValue[0] === 'style') return pathWithinValue.length === 1 ? 'strokeStyle' : undefined;
  }
  if (ownerType === 'typography') {
    const roles = { fontFamily: 'fontFamily', fontSize: 'dimension', fontWeight: 'fontWeight', letterSpacing: 'dimension', lineHeight: 'number' };
    const roleType = roles[pathWithinValue[0]];
    if (roleType) return pathWithinValue.length === 1 ? roleType : inferValuePathType(roleType, pathWithinValue.slice(1));
  }
  return undefined;
}

function validateTypedTree(doc, type, value, path, resolving = new Set()) {
  if (Array.isArray(value)) {
    if (type === 'cubicBezier') return validateTypeValue(doc, type, value, path, resolving);
    if (type === 'number') {
      value.forEach((item, index) => validateTypedTree(doc, type, item, `${path}[${index}]`, resolving));
      return;
    }
    if (type === 'fontFamily') return validateTypeValue(doc, type, value, path, resolving);
    fail(`Unexpected array for type ${type}.`, path);
  }
  if (!isObject(value)) {
    if (type === 'boolean') {
      if (typeof value !== 'boolean') fail('Boolean value expected.', path);
      return;
    }
    validateTypeValue(doc, type, value, path, resolving);
    return;
  }
  const roles = {
    color: {
      colorSpace: 'string', components: 'number', alpha: 'number', hex: 'string',
      __array: { components: 'number' }
    },
    dimension: { value: 'number', unit: 'string' },
    duration: { value: 'number', unit: 'string' },
    shadow: {
      color: 'color', offsetX: 'dimension', offsetY: 'dimension', blur: 'dimension', spread: 'dimension', inset: 'boolean'
    },
    border: { color: 'color', width: 'dimension', style: 'strokeStyle' },
    transition: { duration: 'duration', delay: 'duration', timingFunction: 'cubicBezier' },
    typography: {
      fontFamily: 'fontFamily', fontSize: 'dimension', fontWeight: 'fontWeight', letterSpacing: 'dimension', lineHeight: 'number'
    },
    gradient: { color: 'color', position: 'number' }
  };
  if (!roles[type]) return validateTypeValue(doc, type, value, path, resolving);
  for (const [key, child] of Object.entries(value)) {
    if (key === '$ref' && typeof child === 'string') {
      validateReferenceOrValue(doc, roles[type][key], child, `${path}.${key}`, resolving);
      continue;
    }
    const childType = roles[type][key] || (roles[type].__array && roles[type].__array[key]);
    if (!childType) return validateTypeValue(doc, type, value, path, resolving);
    if (Array.isArray(child) && childType === 'number') {
      child.forEach((item, index) => validateTypedTree(doc, childType, item, `${path}.${key}[${index}]`, resolving));
    } else {
      validateTypedTree(doc, childType, child, `${path}.${key}`, resolving);
    }
  }
}

function collectReferenceStrings(value) {
  const refs = [];
  function visit(node) {
    if (typeof node === 'string') {
      if (node.startsWith('{') || node.startsWith('#/')) refs.push(node);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (isObject(node)) {
      for (const [key, child] of Object.entries(node)) {
        if (key === '$ref' || !key.startsWith('$')) visit(child);
      }
    }
  }
  visit(value);
  return refs;
}

module.exports = {
  KNOWN_TYPES,
  isObject,
  isToken,
  isReferenceToken,
  fail,
  parseReference,
  tokenFromPointer,
  referenceValue,
  pointerGet,
  pointerForPath,
  collectTokens,
  collectGroups,
  findEffectiveToken,
  effectiveTokenAtPointer,
  effectiveTokenPointer,
  validateTokens,
  resolveTokenType,
  resolveRefType,
  resolveExtends,
  mergeObjects,
  collectReferenceStrings,
  tokenKey,
};
