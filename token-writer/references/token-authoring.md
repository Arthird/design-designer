# Token Authoring Reference

## Format contract

Use [Design Tokens Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/) as the only applicable token format authority for this ecosystem. It is a Design Tokens Community Group specification, not a W3C standard.

Core rules used by the supplied tooling:

- A file and every nested group are JSON objects.
- An object with `$value` is a token. An object without `$value` is a group. A token cannot also contain child groups or tokens.
- The reserved `$root` name may be used for a token that represents a group's base value.
- Every token's type must be explicit, inherited from a group, or inherited from its alias target. Tools must not infer it by examining the value.
- Token and group names must not start with `$` (except the reserved `$root` token) and must not contain `.`, `{`, or `}`.
- `{group.token}` resolves a complete token value. References in composite sub-values resolve the referenced token's `$value` when they name a token rather than a property.
- The format describes JSON Pointer support through `$ref` as required for implementations, while documents using only curly references remain common. The supplied validator supports both forms. Alias chains and group extensions must be acyclic.
- A `$ref` is a token property; it can point to a complete `$value` or a property within a value. Declare the referencing token's `$type` when targeting a property.
- `$description`, `$extensions`, and `$deprecated` are metadata, not substitutes for proper type/value declarations.

The supplied validator implements the core normative type set and rejects undocumented custom types.

Type resolution respects `$extends`: inherited tokens retain their own paths and are resolved through the extended group for type and CSS generation. Test extended groups when adopting them, because support details vary by tool.

## Type guidance

| Type | Use | Value shape |
|---|---|---|
| `color` | Colors and semantic color roles | object with `colorSpace`, `components`, optional `alpha`/`hex` |
| `dimension` | Spacing, size, radii, thickness | `{ "value": number, "unit": "px"|"rem" }` |
| `fontFamily` | Single family or fallback stack | string or non-empty string array |
| `fontWeight` | Typographic weight | number 1–1000 or defined alias string |
| `duration` | Motion timing | `{ "value": number, "unit": "ms"|"s" }` |
| `cubicBezier` | Motion easing | four-number array with x coordinates in `[0, 1]` |
| `number` | Unitless line height, opacity, fraction | JSON number |
| `strokeStyle` | Border/line style | defined string or `dashArray`/`lineCap` object |
| `border` | Composite border | `color`, `width`, `style` |
| `transition` | Composite timing | `duration`, `delay`, `timingFunction` |
| `shadow` | One or multiple shadows | shadow object or array of objects/references |
| `gradient` | Stops | array of `color`/`position` objects and references |
| `typography` | Composite text style | `fontFamily`, `fontSize`, `fontWeight`, `letterSpacing`, `lineHeight` |

The non-normative "additional types" section does not define a core `string` token type. Prefer one of the table's normative types. If a project-specific extension is unavoidable, document it separately; the supplied validator rejects `string` rather than claiming full core-format compliance.

Use references for sub-values where their meaning is shared. Do not use a reference to a token of an incompatible type.

## Naming and architecture

A practical structure starts with project groups, then semantic roles:

```json
{
  "color": {
    "$type": "color",
    "text": {
      "primary": { "$value": { "colorSpace": "srgb", "components": [0.1, 0.12, 0.16], "hex": "#1a1f2b" } },
      "on-accent": { "$value": "{color.text.primary}" }
    }
  }
}
```

Avoid tokens named only for appearance unless the project genuinely needs primitives. Prefer names that communicate role and usage, such as `color.text.muted` or `space.inline.md`. Names must remain stable across aesthetic refreshes when meaning remains stable.

Do not create a token for every CSS declaration. Tokens represent reusable design decisions; local component geometry that is not part of the system remains local and documented.

## CSS generator support

The supplied generator maps these values into global custom properties:

- scalar types: `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, and `number`;
- string-valued `strokeStyle` and `border`, `transition`, and `shadow` shorthands;
- `typography` as component custom properties for family, size, weight, spacing, and line height.

It rejects format-valid cases it cannot represent losslessly, including:

- object-valued `strokeStyle` whose dash pattern and line cap cannot be represented by a CSS border style;
- `gradient`, because the 2025.10 token value does not encode the required CSS gradient direction.

On rejection, keep the token valid or model the necessary project-specific choice separately; do not hand-author misleading CSS. Update the generator only when the project has a documented lossless mapping.

## Platform review

Format validity is not platform compatibility.

- Verify color-space support and fallback availability.
- Define how `rem` maps on native targets where it has no direct equivalent.
- Confirm font families are bundled or have approved fallbacks.
- Confirm dimensions map without unintended layout changes at different densities.
- Verify motion durations/timing respect platform reduced-motion conventions.
- Review generated CSS var name collisions before changing token paths.

Record conversion assumptions and known losses near the generated output or in project documentation.
