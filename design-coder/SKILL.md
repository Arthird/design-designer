---
name: design-coder
description: Create or revise static HTML/CSS visual component prototypes from an approved design-system specification. Use for semantic markup, scoped BEM styling, CSS-reproducible states, and documented visual-only prototypes; do not use for JavaScript, application logic, or production functionality.
metadata:
  short-description: Build CSS-only component prototypes
---

# Design Coder

Produce a static visual prototype that demonstrates approved component design in HTML and CSS. It is not a functional implementation and does not become production-ready merely because its markup and styling are complete.

Respond in the language the user uses. Keep code, comments, artifact headings, and TODOs in English unless the enclosing project uses another documentation language.

Read [references/prototype-rules.md](references/prototype-rules.md) before deciding state representation or BEM scope. Read [references/sources.md](references/sources.md) when primary standards or platform guidance are needed; official standards override this skill when they are more restrictive.

## Required inputs

When called directly, inspect the project before asking anything. Locate the design system and read:

1. `design-system/base-rules.md`
2. the target `design-system/components/<component-name>/component.md`
3. `design-system/components.md`
4. `design-system/design-tokens.json` and `design-system/style.css`
5. `design-system/exceptions.md` entries for this component
6. relevant existing project components and conventions

Ask only for missing target component, approved design direction, or platform constraints that cannot be inferred. If `component.md` is absent or not approved enough to determine required states, draft the missing specification with the user before prototyping. Do not invent requirements to avoid a specification step.

## Workflow

1. Confirm the target component, visual scope, target platforms, and approved states.
2. Confirm that `style.css` was generated from the current token file and contains the needed custom properties. Run `node design-system/scripts/generate-css.js` if the generator exists. If the project documents another generator path, use that deterministic command. If there is no token source or generator, involve `$token-writer` or the orchestrator instead of manually editing global CSS.
3. Choose appropriate semantic HTML elements for the component's meaning. Do not use a generic `div` for a button, link, field, heading, or other native control when a semantic element exists.
4. Define the block name from the approved component name. Use `block`, `block__element`, and `block--modifier` classes consistently in both HTML and CSS.
5. Style component-specific rules in `component.css`. Use generated custom properties for shared colors, spacing, type, radii, shadows, and transitions. Keep exceptions local to this component and its approved record.
6. Implement visual states that CSS natively represents with pseudo-classes, selectors, and modifiers. Create static HTML examples only where a fixed visual state cannot be reached by CSS alone.
7. Document unsupported behavior and add a precise `TODO` where a reviewer will naturally see it. Do not add placeholder JavaScript or simulate completion, loading changes, submission, data, validation, or navigation.
8. Update the component's prototype status in `design-system/components.md`; update state coverage in `component.md` if the implementation reveals a classification correction.
9. Run an appropriate audit with `$design-auditor` or the project's audit command. Fix material prototype defects before labeling the component `Completed`. Set `Reviewed` only when the audit is complete and significant issues are resolved or explicitly recorded; use `Approved` for design status only when the reviewed specification still represents the implementation.

## State classes

Classify every required state in the component specification and implement it accordingly:

- **CSS-reproducible:** hover, focus, focus-visible, active, checked, and CSS-representable disabled states. Prefer native selectors. Use an explicit modifier only when native state cannot communicate a fixed prototype requirement.
- **Static visual:** loading, error, success, empty, and application-controlled selected or expanded presentation. Use a clearly named modifier and/or a separate HTML example with static text and markup.
- **Functional behavior:** submission, data loading, application validation, real menu disclosure via script, routing, and state changes. Document expected behavior and leave a `TODO`; do not implement it.

Do not make static classes look like a live implementation. For example, a `.alert--success` example may show the approved success appearance, but it must not imply that validation just occurred.

## Files and naming

Keep the project structure:

```text
design-system/
├── style.css                         # generated; never hand-edit
└── components/<component-name>/
    ├── component.md
    ├── component.css                 # scoped component styling
    └── <component-name>[-state].html # one base plus needed static states
```

Each HTML example must link `../../style.css` and `./component.css` when the prototype follows the default `design-system/components/<component-name>/` layout. If the project requires another documented layout, preserve the same separation: generated global styles, then component-scoped styles.

Use local class names that begin with the component block. Avoid element-wide selectors, unrelated global overrides, IDs for styling, deep descendant coupling, and styles for other components. Shared rules that truly affect the system belong in the generator's base-style template, coordinated with `$token-writer`, not copied into this component.

Keep generated token values out of `component.css` when a corresponding CSS custom property exists. Component-local dimensions or calculations may be local only when the approved design requires them and duplication would change semantics.

## Output statement

End the work with an honest label, for example: `Visual prototype: component CSS and static state examples complete; functional behavior remains unimplemented.` Include files changed, state coverage, audit status, and remaining TODOs.
