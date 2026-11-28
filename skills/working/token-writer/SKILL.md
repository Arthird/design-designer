---
name: token-writer
description: Create, extend, and repair design-tokens.json under the Design Tokens 2025.10 knowledge rules, project constraints, semantic aliases, and deterministic CSS generation. Use when defining or changing tokens; do not use to hand-edit generated style.css or implement components.
metadata:
  short-description: Create and validate design tokens
---

# Token Writer

Own `design-system/design-tokens.json`. Produce valid, maintainable tokens that express the project's approved design direction and fit its actual platforms.

Respond in the language the user uses. Keep token descriptions and artifact headings in English unless the project has another documentation language.

For contributor-level acceptance checks, use the canonical [manual verification guide](https://github.com/Arthird/design-designer/blob/master/shared/workflow/manual-verification.md).

## Dependencies and checkpoints

| Dependency | Type | Checkpoint and trigger | Mandatory? | If unavailable |
|---|---|---|---|---|
| `design-tokens-standard` | knowledge | Before deciding token structure, type, value shape, alias/reference form, inheritance, deprecation, or CSS/platform mapping. | Mandatory for every token change. | Stop authoring and report the missing format authority; do not substitute remembered token syntax. |
| `web-accessibility` | knowledge | Before recording a color pair, reviewing contrast implications, or claiming a token choice satisfies accessibility. | Mandatory when color or accessibility claims are involved. | Preserve the risk as unverified and do not claim compliance. |
| `apple-platform-guidance` | knowledge | Before choosing units, styles, or native mappings for a confirmed Apple target. | Mandatory for Apple targets. | Document the conversion as unresolved and use no guessed native equivalent. |
| `material-platform-guidance` | knowledge | Before choosing units, styles, or native mappings for a confirmed Material target. | Mandatory for Material targets. | Document the conversion as unresolved and use no guessed native equivalent. |
| `design-auditor` | handoff target | After token changes and generation, before saying a component or system is reviewed. It is not invoked by this skill. | Mandatory for a reviewed status; coordinated by `design-designer` or the user. | Leave review status unchanged and report that specialist audit is outstanding. |
| `design-coder` | handoff target | Only after approved token changes need to be reflected in component CSS. It is not invoked by this skill. | Optional; coordinated by `design-designer` as separate component work. | Do not broaden into prototype files; report the component handoff. |

This skill does not invoke another working skill and does not create circular dependencies. It consults knowledge first, edits token data second, and reports a handoff when audit or component work is needed.

## Context to inspect

When called directly, inspect the project before asking questions. Read or locate:

- `design-system/base-rules.md` for approved visual and accessibility decisions;
- platform, framework, build, and target-device configuration;
- existing `design-tokens.json`, generated `style.css`, validator/generator scripts, and component usage;
- component CSS to understand token dependencies without changing component scope;
- exceptions and documented design references.

Ask only for missing design decisions, platforms, or constraints that materially change values or types. Do not ask the user to restate information already present.

## Workflow

1. Read `design-tokens-standard` before changing the token model.
2. Decide whether to reuse, extend, migrate, or create the token structure. Preserve existing valid names and values when they remain appropriate.
3. Define semantic roles and any useful primitives. Prefer aliases for shared meaning; do not create tokens for every CSS declaration.
4. Choose each token's type through the knowledge skill's type-resolution rules: explicit type, inherited group type, or complete-token alias target. Never infer from a token name or value.
5. Build valid groups and values. Use complete-token references when appropriate, `$ref` for property-level access, and `$extends` only for group inheritance. Keep all chains acyclic.
6. Add descriptions and deprecation migration notes where intent is not obvious.
7. Review target-platform implications and any unsupported transformation separately from format validity.
8. Run the project validator and generator:

```bash
node design-system/scripts/validate-tokens.js
node design-system/scripts/generate-css.js
```

If the project lacks these operational tools, use the tool copies from the ecosystem's project template. Do not substitute LLM-authored CSS for generated output.
9. Inspect generated CSS and component usage for broken custom-property names or missing mappings. Update the project-level `design-system/changelog.md` for meaningful public token changes.
10. Hand off to `$design-auditor` or recommend it to the user after substantial token changes.

## Token decisions

Use `design-tokens-standard` as the source of truth for:

- core types and value structures;
- token/group boundaries;
- names and reserved properties;
- full-token versus property-level references;
- group inheritance and cycle detection;
- deprecations and metadata.

Do not hand-maintain a second interpretation of these rules in this working skill.

## Generator boundary

`design-system/style.css` is generated output. Never edit it manually. If the project requires shared structural CSS, update the generator's style template and rerun the generator. If a format-valid token cannot be represented losslessly in CSS, fail or document the boundary rather than emitting misleading CSS.

## Completion criteria

Token JSON parses and validates; references resolve without cycles; every type is determinable; values match types; names remain stable and valid; deterministic generation succeeds; component usages still resolve; and platform/accessibility limitations are explicitly recorded. Format validity alone does not establish visual quality or accessibility compliance.
