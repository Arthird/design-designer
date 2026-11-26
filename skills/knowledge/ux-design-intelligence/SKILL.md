---
name: ux-design-intelligence
description: Apply product-aware UX and visual-design judgment when choosing or critiquing a design direction, palette, typography system, layout, component pattern, interaction, responsive behavior, or platform-specific UI. Use for design synthesis and recommendations; do not use to override normative accessibility rules or to install or modify external skills.
metadata:
  short-description: UX and visual design intelligence
  source-last-checked: "2026-11-26"
---

# UX Design Intelligence

Provide actionable UX and visual-design judgment for a specific product, audience, platform, and constraint set. This is a knowledge skill: it informs decisions but does not install dependencies, edit project files, or replace the working skills that execute design-system tasks.

## Source of truth

- **Primary source:** UI UX Pro Max, `ui-ux-pro-max` skill.
- **Official URL:** <https://github.com/nextlevelbuilder/ui-ux-pro-max-skill>
- **Version/revision:** commit `b73ee96f8d4ff7bbc279c52dadcd907ffe23629c`; MIT license.
- **Last checked:** 2026-11-26.

The external skill is an optional design-intelligence resource, not a normative accessibility or platform standard. Do not copy, modify, redistribute, or claim to have used it without inspecting its installed instructions and relevant local resources. If it is unavailable, use the fallback decision rules below and label them as a general fallback rather than a database-backed recommendation.

For source metadata and the update review process, read [references/source-metadata.md](references/source-metadata.md).

## When to use

Use when a decision concerns:

- visual direction, product style, palette, typography, density, or landing-page structure;
- UX quality of navigation, forms, feedback, onboarding, search, or data display;
- fit between a pattern and a product category, audience, brand, or interaction context;
- comparative critique of competing visual options.

Do not use it for a pure backend concern, data correctness, or an accessibility criterion. Those need the applicable technical or accessibility knowledge skill.

## Decision procedure

1. Establish product type, audience, jobs, platform, stack, accessibility target, and brand constraints. Do not infer a stack silently.
2. Separate hard constraints from aesthetic preferences. Normative accessibility, platform conventions, and approved project rules win over style recommendations.
3. If the external `ui-ux-pro-max` skill is installed and discoverable, read its `SKILL.md` and only the relevant references. In a Codex project, its installed location is normally `.agents/skills/ui-ux-pro-max/`; find that directory rather than relying on a hardcoded plugin root. Use the location named by its own instructions and run only the relevant local search tool with one dominant intent and a small, product-specific query. Never include secrets or private user data.
4. Validate the returned result against the actual project. Record whether a recommendation is a verified database match, a general fallback, or a project decision.
5. Produce a concise decision package: direction, rationale, typography, color roles, spacing/density, component behavior, motion, responsive strategy, anti-patterns, and unresolved questions.
6. Hand normative checks to `web-accessibility`, implementation rules to `web-ui-foundations` and `bem-components`, and tokens to `design-tokens-standard`.

## Fallback decision algorithm

Use this only when the external skill is unavailable or produces no verified match.

| Question | Decision rule |
|---|---|
| Is the product task-dense or content-led? | Task-dense products need stronger hierarchy, compact but breathable spacing, and scan-friendly states. Content-led products need longer line measures, calmer contrast, and emphasis on typography and media. |
| Is the audience expert or general? | Expert tools may support denser information and shortcuts but still need discoverable controls. General audiences need progressive disclosure and explicit labels. |
| Is the platform mouse/keyboard, touch, or mixed? | Avoid hover-only affordances on touch. Preserve visible focus and adequate targets on keyboard and touch. |
| Is the visual direction restrained or expressive? | Choose expressive styling for brand differentiation only when it does not reduce legibility, state clarity, or interaction predictability. |
| Are two options close? | Prefer the option that preserves semantics, accessibility, and cross-platform consistency; then prefer fewer novel mechanisms. |

## Evaluation criteria

- **Product fit:** style and component choices explain the product's purpose and audience.
- **Hierarchy:** primary actions and content are obvious on first scan.
- **Consistency:** repeated roles use the same visual grammar.
- **Interaction clarity:** controls have recognisable affordances and complete visible states.
- **Responsive robustness:** priority and readability survive narrow and wide layouts.
- **Platform fit:** conventions suit the actual platform rather than a generic web assumption.
- **Restraint:** decorative choices do not obscure meaning or add maintenance without user benefit.
- **Evidence quality:** verified matches are distinguished from fallback judgment.

## Example decisions

- For an internal analytics tool, recommend a calm neutral surface, explicit status colors, monospace numerals for comparative data, and a denser spacing scale. Reject a decorative gradient that competes with chart data.
- For consumer onboarding, recommend one decision per screen, visible progress, plain-language labels, and a strong primary action. Reject hidden navigation or error states that depend on color alone.
- For a mobile form, recommend visible labels and native controls; reject placeholder-only labeling even when a visual trend celebrates it.

## Output contract

Return a decision, the reason, relevant tradeoffs, applicable hard constraints, and the confidence/evidence level. When external design intelligence is not installed, state that plainly once and provide the fallback result.
