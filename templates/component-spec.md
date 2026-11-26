# <Component Name>

## Overview

Purpose: <what user need this component serves>.

## Design specification

- <anatomy and hierarchy>
- <geometry, typography, color, border, elevation, motion decisions>
- <content and icon rules>

## Variants

- <variant name and when to use it>
- <omitted or intentionally unsupported variants>

## State coverage

| State | Classification | CSS handling | Static example | Unimplemented behavior |
|---|---|---|---|---|
| Default | CSS-reproducible | Base class | `<component>.html` | None |
| Hover | CSS-reproducible | `:hover` where applicable | None | None |
| Focus | CSS-reproducible | `:focus-visible` | None | Platform manages focus movement |
| Disabled | CSS-reproducible | Native disabled state where applicable | None | Application owns disabled state |
| Loading | Static visual | Explicit modifier and static markup | `<component>-loading.html` | TODO: application must start/stop and announce progress. |

Use only `CSS-reproducible`, `Static visual`, and `Functional behavior` as classifications. Remove sample rows that do not apply.

## Interactions and expected behavior

Document keyboard, pointer, and platform behavior. Mark functional behavior that HTML/CSS cannot implement with a precise `TODO`; do not add JavaScript in the prototype.

## Responsive behavior

Document wrapping, reflow, priority, viewport/container changes, and platform-specific constraints.

## Accessibility requirements

Document intended native semantics, accessible name, keyboard behavior, focus, errors/status, contrast, target size, motion, and any platform-specific expectations.

## Dependencies

List required design-system tokens, components, assets, and generated styles.

## Exceptions

State `None.` or link each local exception and its recorded accessibility impact.

## References

- `<component>.html`
- `<component>-<state>.html` when needed
- `component.css`
- `../../style.css`
- Relevant knowledge-skill criteria used at specification time
