---
name: design-tokens-standard
description: Apply Design Tokens 2025.10 and deterministic transformation guidance when defining, reviewing, or translating design-token data. Use for token types, groups, aliases, references, extensions, CSS mappings, and platform boundaries; do not use as an implementation workflow or as an accessibility validator.
metadata:
  short-description: Design Tokens 2025.10 knowledge
  source-last-checked: "2026-11-26"
---

# Design Tokens Standard

Provide authoritative token-format knowledge and transformation criteria. `token-writer` owns the token-writing workflow; this knowledge skill supplies the rules that workflow must apply.

## Source of truth

- **Primary source:** Design Tokens Community Group, Design Tokens Format Module 2025.10.
- **Official URL:** <https://www.designtokens.org/TR/2025.10/format/>
- **Version/revision:** 2025.10 (pinned).
- **Last checked:** 2026-11-26.

This is a Design Tokens Community Group specification, not a W3C Standard. The [Color](https://www.designtokens.org/TR/2025.10/color/) module is part of the same version family. Treat examples and the additional-types section as authoritative only to their stated normative scope.

Source and update details are in [references/source-metadata.md](references/source-metadata.md).

## When to use

Use for token/group structure, type selection, value-shape decisions, alias semantics, JSON Pointer references, `$extends`, deprecation metadata, validation expectations, and mapping token values to a target platform or generated CSS.

Do not use it to decide visual style, accessibility compliance, or which components a product needs.

## Token decision algorithm

1. Identify whether each object is a token (`$value` or `$ref`) or a group. A token cannot also contain child tokens.
2. Determine a token's type from its explicit `$type`, its resolved group type, or its complete-token alias target. Never infer type from a name or value shape.
3. Choose only a core normative type: `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `number`, `strokeStyle`, `border`, `transition`, `shadow`, `gradient`, or `typography`.
4. Use `{group.token}` to resolve a complete token value. Use `$ref` plus a JSON Pointer for a complete `$value` or a property-level reference; declare a type when the reference alone cannot determine it.
5. Validate required composite sub-values and reference types. Detect unresolved paths, cycles, invalid names, and incompatible aliases.
6. Keep names stable, case-consistent, and free of `.`, `{`, or `}`. Reserve `$` names; `$root` is the named root-token exception.
7. Decide conversion separately for the target platform. `px` and `rem` are format units, not universal native units; color spaces and fallbacks need platform review.
8. Generate output with a deterministic tool. Never infer CSS declarations as a replacement for a transformation step that cannot represent the token losslessly.

## Reference rules

| Need | Preferred form | Constraint |
|---|---|---|
| Complete semantic alias | `{color.text.primary}` | Target must be a token; returns its `$value` |
| Complete value via JSON Pointer | `$ref: '#/color/text/primary/$value'` | Target must exist; type must be declared or resolvable |
| Individual property | `$ref` to the property path | Declare a compatible type on the referencing token |
| Group inheritance | `$extends: '{base.group}'` or `$ref` form | May target only a group; no cycles |
| Deprecated role | `$deprecated` plus migration guidance | Does not provide the replacement automatically |

## Validation criteria

- JSON parses and every object has valid token/group structure.
- Every token type is determinable and known within the supported set.
- Names are valid and case collisions are treated as a portability warning.
- All references resolve; alias and extension graphs are acyclic.
- Primitive values and composite structures match their types.
- Type changes and token removals have an explicit migration impact.
- Platform transformation limitations are recorded, not hidden behind hand-authored output.

## Transformation guidance

Use [Style Dictionary](https://www.styledictionary.org/) 5.8.0 as implementation guidance for deterministic multi-platform transforms. Its transforms and output formats are not the token format itself. If the project uses a custom generator, require explicit support for references, value formatting, stable ordering, and failure on unsupported values.

## Output contract

State the type and reference decision, platform implication, validation result, and any unsupported mapping. Do not report a format pass as accessibility or visual approval.
