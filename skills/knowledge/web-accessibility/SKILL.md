---
name: web-accessibility
description: Apply WCAG 2.2 and WAI-ARIA Authoring Practices when designing or auditing web interfaces. Use for contrast, keyboard access, names and roles, focus, states, forms, dynamic updates, and component interaction requirements; do not use to claim runtime accessibility from static files alone.
metadata:
  short-description: WCAG and ARIA knowledge
  source-last-checked: "2026-11-26"
---

# Web Accessibility

Provide normative web accessibility requirements and applicable ARIA design patterns. This is a knowledge skill: it sets acceptance criteria and identifies manual verification needs; the auditor and visual implementer remain responsible for execution.

## Source of truth

- **Primary normative source:** W3C, Web Content Accessibility Guidelines (WCAG) 2.2.
- **Official URL:** <https://www.w3.org/TR/WCAG22/>
- **Version/revision:** WCAG 2.2.
- **Last checked:** 2026-11-26.

Use the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) for accessible widget patterns and keyboard conventions. APG is implementation guidance, not a normative substitute for WCAG or HTML semantics.

Source and update details are in [references/source-metadata.md](references/source-metadata.md).

## When to use

Use when a web interface has text, controls, forms, navigation, data displays, focus management, motion, or dynamic status. Use at design review, component specification, prototype audit, and final review. For native projects, WCAG 2.2 and APG can provide a useful baseline for general accessibility expectations, but they do not cover native platform APIs, VoiceOver/TalkBack behavior, or complete native accessibility certification.

## Evaluation algorithm

1. Identify the user task, control type, platform input methods, and relevant content. Choose the native HTML element before considering ARIA.
2. Check semantic structure, accessible name, role, state, and value. Use APG only when a native pattern cannot express the required widget.
3. Verify keyboard reachability, logical focus order, visible focus, and expected key behavior. Do not accept hover-only access.
4. Check text and non-text contrast, target spacing, text resizing/reflow, reduced motion, and color not used as the sole cue.
5. Check form labels, instructions, error identification, status announcements, and programmatic relationships.
6. Classify each result as a confirmed static finding, a suspected runtime issue, a recommendation, or unverifiable without testing.

## Actionable thresholds and cautions

| Concern | Requirement to check | Caution |
|---|---|---|
| Normal text contrast | 4.5:1 minimum under WCAG 2.2 AA | Confirm the text role and actual background/state |
| Large text contrast | 3:1 minimum under WCAG 2.2 AA | Use the specification's size/weight definition |
| Non-text contrast | 3:1 where required for meaningful UI boundaries and graphics | A contrast ratio alone does not prove complete compliance |
| Keyboard operation | Every function is operable without pointer-only input | Static CSS cannot prove runtime keyboard behavior |
| Focus | Visible focus and no obscured focus target | Test focus movement, tab order, and sticky overlays |
| Content reflow | Use and meaning survive required zoom/reflow conditions | Visual snapshots are not full verification |
| Names/instructions | Programmatically determinable labels and instructions | Placeholder text is not a substitute for a label |
| Dynamic status | State changes are exposed appropriately | Automatic announcements can be noisy; manual testing is required |

## Interaction-pattern decision

- Use a native `<button>` for an action and `<a href>` for navigation.
- Use native labeled form controls before creating an ARIA composite widget.
- Use APG patterns for menu buttons, dialogs, tabs, comboboxes, and other widgets only when their complete keyboard interaction will be implemented in the production layer.
- If the production behavior is out of scope for a visual prototype, document the needed runtime pattern and mark it unverified.
- Do not add ARIA roles as decoration. A static example with an incorrect role or missing state is a confirmed problem, not a neutral placeholder.

## Output contract

Every accessibility finding includes location, criterion/pattern, observed evidence, severity, needed correction, and verification status. Web checks do not establish complete native accessibility coverage. Never say automated checks guarantee accessibility.
