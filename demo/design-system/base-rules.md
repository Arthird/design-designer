# Demo Project Design Rules

This is a demo project for exercising the skill workflows. Its decisions are examples, not reusable default design rules. It was checked as static HTML/CSS; native interaction and assistive-technology behavior remain production concerns.

## Project context

| Decision | Status | Value |
|---|---|---|
| Target platform | Assumed | Responsive web |
| Rendering | Confirmed by example | Semantic HTML and CSS |
| Audience | Assumed | General productivity users |
| Accessibility target | Project decision | WCAG 2.2 AA for documented web content |

## Design principles

- Make actions and hierarchy recognizable without decorative noise.
- Use semantic color roles rather than component-specific color literals.
- Keep focus visible and interactive targets comfortably sized.
- Prefer native HTML semantics and platform conventions.

## Visual language

Calm, high-legibility workstation UI. Surfaces are cool neutral, the blue accent is reserved for primary action, and borders/shadows are restrained. Avoid gradients and ornamental illustrations in controls.

## Typography

Use the sans family token with a system fallback. Body text is 1rem/1.5; headings are 1.5rem/1.25 at semibold. Do not set body text below 0.875rem. Preserve user zoom and text scaling.

## Color usage

Text primary is near-black on light surfaces. Primary buttons use accent with white labels. Do not use color alone to indicate errors, selection, or required status. The documented primary-text/raised-surface pair must be reviewed with automation, but the ratio alone is not a complete accessibility result.

Contrast pair: #1a1f2b on #ffffff
Contrast pair: #ffffff on #135dec

## Spacing and layout

Use the dimensions under `space`. Keep inline spacing for sibling controls and stack spacing for vertical rhythm. At narrow widths, let preview content wrap; do not encode a device-specific breakpoint without a project requirement.

## Borders, radii, and shadows

Use the default border for cards and separators. Use `radius.md` for buttons and inputs, `radius.full` only for pill controls. Use the control shadow for raised interactive controls; do not stack decorative shadows.

## Iconography

Use simple line icons with a consistent optical size and stroke. Icon-only actions require accessible names. Never use an icon as the only explanation of an unfamiliar action.

## Responsive behavior

Primary action remains visible and reachable. Allow labels and help text to wrap rather than truncating essential meaning. Interactive target size must remain usable when text size increases.

## Accessibility requirements

- Preserve native semantics; add ARIA only when needed and correct.
- Keyboard focus must be visible on every interactive control.
- Labels and instructions must be programmatically exposed.
- Text and meaningful non-text indicators must meet applicable WCAG contrast thresholds.
- Motion must respect reduced-motion preferences where motion is meaningful.
- Static prototypes do not prove keyboard, screen-reader, or runtime accessibility.

## Component principles

Components consume semantic tokens, keep local exceptions in `exceptions.md`, and represent only visual behavior in HTML/CSS. Document JavaScript/application behavior as a requirement and leave it unimplemented.
