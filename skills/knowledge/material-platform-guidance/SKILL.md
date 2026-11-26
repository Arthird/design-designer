---
name: material-platform-guidance
description: Apply Material Design 3 when a project targets Android or a confirmed Material-based interface. Use for Material components, color roles, typography, navigation, adaptive layouts, and interaction conventions; do not apply it to unrelated web or Apple products.
metadata:
  short-description: Material Design 3 knowledge
  source-last-checked: "2026-11-26"
---

# Material Platform Guidance

Provide platform-specific judgment for confirmed Material Design 3 targets. This knowledge skill informs design and implementation requirements but does not implement Android/Material code or validate device behavior.

## Source of truth

- **Primary source:** Material Design 3.
- **Official URL:** <https://m3.material.io/>
- **Version/revision:** current Material 3 documentation; checked 2026-11-26.
- **Last checked:** 2026-11-26.

Source and update details are in [references/source-metadata.md](references/source-metadata.md).

## When to use

Use after confirming Android or a Material-based interface, its framework, target versions, and adaptive-layout requirements. Use for Material component roles, color roles, typography, navigation, state behavior, motion, and responsive layout.

Do not use for a generic web design unless Material is an explicit product decision, and do not use it to override applicable accessibility requirements.

## Decision procedure

1. Confirm the Material target, framework, versions, and device classes.
2. Identify the relevant Material component, layout, or system pattern.
3. Map tokens to Material color and type roles deliberately; do not copy arbitrary hex or font values out of context.
4. Define compact, medium, and expanded adaptive behavior where relevant.
5. Check interaction states, motion, touch targets, text scaling, appearance modes, and accessibility implications; hand normative accessibility questions to `web-accessibility` only when the target is actually web, otherwise use project/platform accessibility criteria.
6. Require runtime/device verification for dynamic interactions and platform system behavior.
7. Record deviations and unresolved native validation in the project exceptions or implementation plan.

## Evaluation criteria

- Material component behavior and role usage match the actual target.
- Color and typography use design-system roles rather than isolated literals.
- Adaptive layouts preserve priority across size classes.
- Interaction, touch, motion, and state behavior are coherent.
- Platform behavior is not confused with universal web behavior.
- Native runtime and assistive-technology checks remain explicit.

## Output contract

State the confirmed Material target, selected pattern, token-role mapping, adaptation decisions, and remaining platform verification.
