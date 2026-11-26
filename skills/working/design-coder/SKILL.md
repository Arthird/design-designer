---
name: design-coder
description: Create or revise static HTML/CSS visual component prototypes from an approved design-system specification. Use for semantic markup, scoped BEM styling, CSS-reproducible states, and documented visual-only prototypes; do not use for JavaScript, application logic, or production functionality.
metadata:
  short-description: Build CSS-only component prototypes
---

# Design Coder

Produce a static visual prototype that demonstrates approved component design in HTML and CSS. It is not a functional implementation and does not become production-ready merely because its markup and styling are complete.

Respond in the language the user uses. Keep code, comments, headings, and TODOs in English unless the enclosing project has another documentation language.

For contributor-level acceptance checks, use the canonical [manual verification guide](https://github.com/Arthird/design-designer/blob/master/shared/workflow/manual-verification.md).

## Dependencies and checkpoints

Inspect skills by exact name before relying on them. Knowledge skills set rules; they do not edit files. Do not invoke the orchestrator or another working skill just to obtain knowledge.

| Dependency | Type | Checkpoint and trigger | Mandatory? | If unavailable |
|---|---|---|---|---|
| `design-tokens-standard` | knowledge | Before changing token semantics or deciding that a required global role is missing. Do not edit `design-tokens.json` yourself. | Mandatory only when a token-source change is required. | Hand the token need back to the orchestrator/user for `$token-writer`; do not invent a token. |
| `web-ui-foundations` | knowledge | Before selecting HTML elements, CSS state mechanisms, custom-property use, layout, or responsive rules for web output. | Mandatory for web prototypes. | Use only a documented project equivalent; otherwise stop before implementation and report the missing authority. |
| `bem-components` | knowledge | Before assigning block/element/modifier names or scoping component CSS when BEM is adopted. | Mandatory when the project uses BEM. | Use the project's documented alternative naming convention; do not silently mix systems. |
| `web-accessibility` | knowledge | Before finalizing any control, keyboard interaction, focus behavior, form, dynamic visual state, or accessibility claim. | Mandatory for web UI. | Preserve the component's stated requirements, mark verified accessibility as incomplete, and do not claim compliance. |
| `apple-platform-guidance` | knowledge | Before producing platform-specific behavior for a confirmed Apple target. | Mandatory only for Apple targets. | Do not replace it with web assumptions; leave Apple-specific behavior unresolved. |
| `material-platform-guidance` | knowledge | Before producing platform-specific behavior for a confirmed Material target. | Mandatory only for Material targets. | Do not replace it with web assumptions; leave Material-specific behavior unresolved. |
| `design-auditor` | working | After the example and CSS are complete, before changing the prototype status to `Reviewed`. | Mandatory for a reviewed status, normally coordinated by `design-designer`. | Leave status at `Completed` at most and state that independent audit is outstanding. |
| `token-writer` | working | When approved tokens are missing, invalid, or need a public semantic change. | Mandatory for token changes, normally coordinated by `design-designer`. | Hand off the token need; never hand-edit global CSS to bypass the workflow. |

`design-coder` may consult knowledge skills. When a working dependency is required, it reports a handoff to the orchestrator/user rather than launching another working skill. This keeps direct invocation usable without creating a circular working-skill graph.

## Required inputs

When called directly, inspect the project before asking anything. Locate and read:

1. `design-system/base-rules.md`
2. target `design-system/components/<component-name>/component.md`
3. `design-system/components.md`
4. `design-system/design-tokens.json` and generated `design-system/style.css`
5. relevant entries in `design-system/exceptions.md`
6. existing project components and approved conventions

Ask only for a missing target component, approved design direction, or platform constraint that cannot be inferred. If `component.md` is absent or insufficient to determine variants and states, draft the specification with the user before prototyping. Do not invent requirements to bypass a specification step.

## Workflow

1. Confirm the target component, visual scope, actual target platforms, and approved states.
2. Check that `style.css` is fresh and generated from the current token source. If a generator exists, run the documented deterministic command. If no token source or generator exists, use the `token-writer` checkpoint; never manually edit global CSS.
3. Consult `web-ui-foundations` before choosing markup and CSS mechanics. Select the native element that expresses the component's meaning: button for action, link for navigation, labeled controls for input, and headings for structure.
4. If BEM applies, consult `bem-components`; name the primary component as the block and use `block`, `block__element`, and `block--modifier` consistently in HTML and CSS.
5. Style in the component's `component.css` using generated custom properties for shared roles. Keep local exceptions within the component and its approved exception entry.
6. Classify and implement every state. Use native selectors and pseudo-classes for CSS-reproducible states; use fixed modifiers/static examples for states CSS cannot reach; document functional behavior as unimplemented.
7. Consult `web-accessibility` for semantic names, labels, focus, keyboard expectations, contrast implications, and dynamic state requirements. If behavior needs JavaScript, document it and add an actionable TODO. Never add script or simulated application behavior.
8. For a confirmed native target, consult only the matching Apple or Material knowledge skill and document any platform-specific expectation that cannot be verified in a static prototype.
9. Update `component.md` state coverage if implementation decisions correct a classification. Update `components.md` only after the files, state coverage, and caveats agree.
10. Hand off to `$design-auditor` after completion or recommend it to the user. Fix material prototype defects before `Completed`; use `Reviewed` only when an audit is complete and significant issues are resolved or explicitly recorded.

## State rules

- **CSS-reproducible:** hover, focus-visible, active, checked, and CSS-representable disabled states. Prefer native selectors; do not create permanent fake-state modifiers for these.
- **Static visual:** loading, error, success, empty, or application-controlled selected/expanded presentation. Use a clearly named modifier and a static example only where needed.
- **Functional behavior:** submission, data loading, application validation, real menu opening/closing, routing, or state mutation. Document it; do not implement it.

Static examples must not imply a real transaction occurred. A `.alert--success` example may show a success appearance but must not claim that validation ran.

## Files and naming

Use the default structure unless the project documents another:

```text
design-system/
├── style.css                         # generated; never hand-edit
└── components/<component-name>/
    ├── component.md
    ├── component.css                 # scoped component styling
    └── <component-name>[-state].html # one base and needed static states
```

Each HTML example links `../../style.css` and `./component.css`. Use the component block for local scope; avoid element-wide rules, IDs for styling, sibling-component selectors, deep descendant chains, and unrelated global overrides. Shared structural CSS belongs in the generator's template mechanism, not in a component file.

## Output contract

End with an honest label such as: `Visual prototype: component CSS and static state examples complete; functional behavior remains unimplemented.` Report files changed, state coverage, knowledge/dependency checks, audit status, and remaining TODOs.
