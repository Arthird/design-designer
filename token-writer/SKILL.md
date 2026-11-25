---
name: token-writer
description: Create, extend, and repair design-tokens.json using the Design Tokens Format Module 2025.10, project rules, platform constraints, semantic aliases, and deterministic CSS generation. Use when defining or changing design tokens; do not use to hand-edit generated style.css or implement components.
metadata:
  short-description: Create and validate design tokens
---

# Token Writer

Own `design-system/design-tokens.json`. Produce valid, maintainable tokens that express the project's approved design direction and work for its actual target platforms.

Respond in the language the user uses. Keep token descriptions and artifact headings in English unless the project already establishes another documentation language.

Read [references/token-authoring.md](references/token-authoring.md) before authoring or changing the token model. Consult [../design-designer/references/sources.md](../design-designer/references/sources.md) for the pinned format and primary references.

## Context to inspect

When called directly, inspect the project before asking questions. Read or locate:

- `design-system/base-rules.md` for approved visual and accessibility decisions;
- platform, framework, build, and target-device configuration;
- existing `design-tokens.json`, generated `style.css`, generator/validator scripts, and component usage;
- existing component CSS to understand token dependencies without changing component scope;
- current exceptions and relevant design references.

Ask only for missing design decisions, target platforms, or constraints that materially change token values/types. Do not ask the user to restate information already in the project.

## Workflow

1. Determine whether to reuse, extend, migrate, or create the token model. Preserve existing names and values when they are valid and project-appropriate.
2. Model primitive values separately from semantic roles only when that distinction helps the project. Prefer semantic tokens for components and use references or aliases for shared intent.
3. Choose a type from the core 2025.10 set: `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `number`, `strokeStyle`, `border`, `transition`, `shadow`, `gradient`, or `typography`. The format's additional-type section is non-normative; do not silently introduce a custom `string` type as if it were core. Never guess a type from a token's name or value; use an inherited group type or explicit type, or resolve it from a valid alias.
4. Use nested token groups for organization. Remember that an object with `$value` is a token and cannot also contain child tokens.
5. Use names that are stable, meaningful, case-consistent, and valid under the format. Do not include braces or periods in names, and do not begin names with `$` except the reserved `$root` token.
6. Represent sizes and durations as type-correct value objects, colors with a supported color space and components, and composite values with every required sub-value. Use `$description` for non-obvious intent and `$deprecated` with a migration note when retiring a token.
7. Use `{path.to.token}` for complete-token aliases and valid composite sub-value references. When reaching a token's `$value` or an individual property is required, use the format-required `$ref` JSON Pointer form and declare the referencing token's type. Keep aliases semantic where they communicate intent.
8. Review target-platform implications. The format's `rem` and `px` are not universal platform units. Document conversion assumptions rather than pretending one file is natively consumable everywhere. Review color-gamut fallback/`hex` support and unsupported CSS mappings separately from format validity.
9. Validate format and references. If the project has `design-system/scripts/validate-tokens.js`, run it. If its validated subset differs from this ecosystem's core subset, report the gap rather than treating a partial validator as proof of full conformance. Otherwise copy/adapt the supplied validator after confirming its location.
10. After every token update, run the deterministic generator rather than writing CSS:

```bash
node design-system/scripts/generate-css.js
node design-system/scripts/validate-tokens.js
```

The generator reads `design-tokens.json`, resolves supported references, fails clearly on invalid/unsupported values, and writes `design-system/style.css`. Never manually edit or regenerate CSS by asking an LLM to reproduce values. If shared base styles are needed, update the generator's `style-template.css` mechanism and then rerun the generator.

11. Re-audit after token changes. Inspect component usage and generated custom-property names for breakage. Update the changelog for meaningful public token additions, removals, type changes, value changes, or deprecations.

## Decisions to explain

Briefly report important choices: primitive versus semantic structure, aliases, color-space and fallback handling, responsive unit assumptions, platform conversion needs, deprecations, and any format-valid token values that the current CSS generator cannot map. Do not imply that format validation checks visual contrast, platform suitability, or complete accessibility.

## Completion criteria

Token JSON parses and validates, all references resolve without cycles, every token's type is determinable, values match their types, names are stable and valid, generated CSS succeeds and is deterministic, relevant component references still resolve, and manual platform/contrast risks are identified.
