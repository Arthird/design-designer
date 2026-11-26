---
name: bem-components
description: Apply BEM class architecture when naming, scoping, or reviewing component HTML and CSS. Use for blocks, elements, modifiers, component-local state classes, and selector boundaries; do not use BEM as a substitute for semantic HTML, accessibility, or design-system token rules.
metadata:
  short-description: BEM component architecture knowledge
  source-last-checked: "2026-11-26"
---

# BEM Components

Provide naming and CSS-scoping criteria for component prototypes. `design-coder` applies them when creating CSS; `design-auditor` uses them to evaluate component architecture.

## Source of truth

- **Primary source:** BEM methodology.
- **Official URL:** <https://en.bem.info/methodology/>
- **Version/revision:** current methodology documentation; naming and CSS pages checked.
- **Last checked:** 2026-11-26.

Supporting pages: [naming convention](https://en.bem.info/methodology/naming-convention/) and [BEM CSS](https://en.bem.info/methodology/css/).

Source and update details are in [references/source-metadata.md](references/source-metadata.md).

## When to use

Use when selecting class names, scoping component CSS, deciding whether a modifier is a durable variant or a state, reviewing selector collisions, or documenting dependencies between blocks.

## Decision algorithm

1. Name the main component as the block. Use lowercase hyphenated words where needed.
2. Name its internal parts with `block__element`. Use elements only for parts owned by the block.
3. Name durable visual/behavioral variants with `block--modifier`. Use a state modifier only for a fixed, explicitly documented state that CSS cannot otherwise demonstrate.
4. Use the same block/element/modifier names in HTML and CSS. Keep component-specific selectors scoped to that block.
5. Avoid deep descendant chains, styling sibling components, IDs for styling, and global element selectors in component CSS.
6. Keep local exceptions within the component and its approved exception record; never promote a component modifier to a global rule implicitly.
7. Document composition with another block when it is intentional. Do not pretend a foreign block belongs to the first component.

## Evaluation criteria

- The block name matches the component specification.
- Elements and modifiers are recognizable and consistently composed.
- A modifier represents a durable variant or a clearly defined fixed visual state.
- Component CSS primarily selects classes under its block and does not create accidental cross-component effects.
- Shared global tokens remain global; local overrides have a narrow, documented scope.
- BEM does not override HTML semantics: a `.button` class on a non-button element is not an accessible button.
- State names communicate the visual or application condition without simulating a live application.

## Example

```html
<button class="button button--secondary" type="button">Cancel</button>
```

```css
.button { /* block */ }
.button__icon { /* element */ }
.button--secondary { /* durable variant */ }
.button:focus-visible { /* native state */ }
```

For an application-controlled loading presentation, use an explicitly documented state modifier and static example only when needed. Leave the real transition to the production layer.

## Output contract

State the block, any element/modifier decision, the scope of the CSS, and any relationship to another block. Flag semantic or accessibility issues separately; rename cleanly does not repair them.
