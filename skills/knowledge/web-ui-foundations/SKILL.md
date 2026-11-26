---
name: web-ui-foundations
description: Apply HTML, CSS, and responsive-layout foundations when specifying or reviewing web UI. Use for semantics, native elements, CSS custom properties, selectors, pseudo-classes, layout, reflow, and explicit visual-state mechanisms; do not use to invent JavaScript behavior or platform-native APIs.
metadata:
  short-description: HTML, CSS, and responsive UI knowledge
  source-last-checked: "2026-11-26"
---

# Web UI Foundations

Provide practical HTML/CSS rules for web design-system documentation and static visual prototypes. This is a knowledge skill: `design-coder` and `design-auditor` apply it to artifacts.

## Source of truth

- **Primary source:** WHATWG HTML Living Standard.
- **Official URL:** <https://html.spec.whatwg.org/>
- **Version/revision:** Living Standard.
- **Last checked:** 2026-11-26.

Use MDN for current practical syntax and browser-oriented explanations: [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), [CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference), [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties), and [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-classes). MDN is supporting documentation; it is not a substitute for the HTML standard when behavior is normative.

Source and update details are in [references/source-metadata.md](references/source-metadata.md).

## When to use

Use when deciding native markup, accessible structure that belongs to semantics, CSS token consumption, selectors, pseudo-class representation, layout, responsive behavior, or whether a desired state can be represented without application code.

## HTML decision algorithm

1. Name the user action or content role before choosing markup.
2. Choose the native element: button for an action, anchor with destination for navigation, input/select/textarea for input, headings for hierarchy.
3. Preserve reading order. Do not create button-like `div` elements or anchor-like spans when a native control exists.
4. Associate visible labels and instructions with controls; use explicit text for icon-only actions and appropriate names for form controls.
5. Add attributes only for present meaning. Do not promise behavior that the static prototype cannot implement.
6. Classify any needed behavior as CSS-reproducible, static visual, or functional and document the boundary.

## CSS decision algorithm

1. Consume global design roles through generated custom properties when available.
2. Scope component styles to the component block. Avoid accidental element-wide or sibling-component selectors.
3. Use `:hover`, `:focus-visible`, `:active`, `:checked`, and native `:disabled` for CSS-native states where appropriate.
4. Use explicit modifiers for durable variants and fixed application-controlled presentation. Do not use a permanent modifier to pretend an interaction is live.
5. Use media queries deliberately for hover capability, motion preference, viewport/container changes, and forced colors. Do not invent breakpoints without project evidence.
6. Keep content usable under narrow width, enlarged text, long labels, and relevant zoom/reflow conditions.
7. Reject raw duplicate token values when a shared custom property exists. Allow documented local values only when they are genuinely component-specific.

## State classification table

| State | CSS representation | Do not do |
|---|---|---|
| Hover | `:hover`, optionally gated by hover-capable media | Require hover for essential access |
| Focus | `:focus-visible` plus visible outline treatment | Remove focus without an equally visible replacement |
| Active | `:active` when appropriate | Use a fake permanent active modifier as a substitute |
| Checked/disabled | Native state selectors | Imply application state that is not actually set |
| Loading/error/success | Fixed static context plus documented production behavior | Simulate a request, validation, navigation, or state transition |
| Expanded/selected menu | Fixed presentation with correct documented semantics | Add JavaScript or claim the interaction works |

## Accessibility seam

Semantics alone do not establish complete accessibility. Hand specific name, role, focus, contrast, and keyboard checks to `web-accessibility`. Static CSS can demonstrate a focus appearance but cannot prove focus traversal or screen-reader behavior.

## Output contract

Explain the selected semantic element, state mechanism, CSS property source, responsive assumption, and unimplemented behavior. Label the result as a visual prototype, not a functional implementation.
