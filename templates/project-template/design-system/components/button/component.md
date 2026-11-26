# Button

## Overview

Purpose: trigger an explicit user action. This is a static web visual prototype specification, not a functional application component or production-ready implementation.

## Design specification

- Use a native `<button>` with a concise action label.
- Primary style uses `--color-accent-default` with `--color-text-on-accent`.
- Secondary style uses a raised surface, primary text, and a visible border.
- Minimum block size is `--size-control-min-block`; inline padding uses `--space-inline-md`.
- Corners use `--radius-md`; elevation uses `--shadow-control`; motion uses `--motion-control`.
- Do not use more than one primary action in a local action group unless the information hierarchy genuinely supports it.

## Variants

- Primary action.
- Secondary action.
- Optional leading icon with visible label.
- Loading presentation for an in-flight operation; the behavior that starts or stops it is functional and not implemented.

## State coverage

| State | Classification | CSS handling | Static example | Unimplemented behavior |
|---|---|---|---|---|
| Default | CSS-reproducible | `.button` base rule | `button.html` | None |
| Hover | CSS-reproducible | `:hover` with hover-capable media query | `button.html` | None |
| Keyboard focus | CSS-reproducible | `:focus-visible` | `button.html` | Focus movement itself is user-agent/browser behavior |
| Active/pressed | CSS-reproducible | `:active` | `button.html` | None |
| Disabled | CSS-reproducible | `:disabled` and `.button--disabled` for static presentation | `button.html`; `button-disabled.html` | Real disabled behavior belongs to native/app state |
| Loading | Static visual | `.button--loading`, `aria-busy="true"`, static spinner | `button-loading.html` | TODO: application must start/stop loading, prevent duplicate actions, and announce status as appropriate. |

## Interactions and expected behavior

The production application must invoke exactly one action on activation, prevent repeated submissions while busy when appropriate, and expose a meaningful accessible name. This visual prototype intentionally has no JavaScript, no event behavior, and no simulated request.

## Responsive behavior

Buttons may wrap their label but should not truncate essential action text. Keep a usable target size when text enlarges. The preview canvas can wrap buttons at narrow widths.

## Accessibility requirements

- Use `<button type="button">` for non-submit examples.
- Keep visible keyboard focus and sufficient contrast in all states.
- Loading must not remove the accessible name; use runtime status reporting where needed.
- Disabled controls must remain identifiable and must not rely on opacity alone to communicate state.
- Disabled examples intentionally omit the focus ring; record this as a local exception if the project instead exposes focusable disabled controls or uses a different native convention.
- Loading animation is visually reduced when `prefers-reduced-motion` is active; production behavior must still ensure the busy state is understandable without animation.

## Dependencies

Global tokens and generated styles from `../../style.css`. No other component is required.

## Exceptions

None. Record future deviations with local scope and accessibility impact in `../../exceptions.md`.

## References

- `button.html`
- `button-disabled.html`
- `button-loading.html`
- `component.css`
- Generated `../../style.css`
- WCAG 2.2 and ARIA Authoring Practices Guide for accessibility review.
- Consult `web-ui-foundations`, `bem-components`, and `web-accessibility` before revising the prototype.
