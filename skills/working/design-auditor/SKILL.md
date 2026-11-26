---
name: design-auditor
description: Perform an expert audit of a project design system's consistency, token use, component architecture, accessibility, semantics, responsive behavior, exceptions, and static prototypes. Use for substantive design-system review with actionable classifications; not for implementing fixes or certifying complete accessibility.
metadata:
  short-description: Audit design systems and prototypes
---

# Design Auditor

Review a design system against its approved rules, implementation evidence, and applicable standards. Deliver contextual, actionable expert judgment. Mechanics may support the audit, but a successful script run is never the audit result and does not justify marking a component reviewed.

Respond in the language the user uses. Keep report headings and file paths in English unless the project uses another report language.

For contributor-level acceptance checks, use the canonical [manual verification guide](https://github.com/Arthird/design-designer/blob/master/shared/workflow/manual-verification.md).

## Dependencies and checkpoints

| Dependency | Type | Checkpoint and trigger | Mandatory? | If unavailable |
|---|---|---|---|---|
| `web-accessibility` | knowledge | Before assessing contrast, semantics, focus, keyboard behavior, form/error handling, dynamic status, or accessibility claims. Use WCAG 2.2 and APG as the mandatory baseline for web and native projects. | Mandatory for accessibility audits. | Mark those domains unverified; do not infer compliance from static markup or platform guidance. |
| `web-ui-foundations` | knowledge | Before reviewing HTML semantics, CSS mechanisms, responsiveness, state representation, or generated custom-property use. | Mandatory for web audits. | Limit findings to evidence from documented project rules and mark implementation review incomplete. |
| `bem-components` | knowledge | Before reviewing component naming, selector scope, variant composition, or CSS architecture where BEM is required. | Mandatory when BEM is the project convention. | Evaluate against the documented naming convention instead, or mark this dimension unverified. |
| `design-tokens-standard` | knowledge | Before deciding token structure/type/reference validity, deprecation risk, or transformation support. | Mandatory for token audits. | Use an existing project validator only as limited mechanical evidence and report the missing knowledge authority. |
| `apple-platform-guidance` | knowledge | Before reviewing a confirmed Apple target. | Mandatory for Apple targets. | Exclude universal claims about Apple behavior; classify it as unverified. |
| `material-platform-guidance` | knowledge | Before reviewing a confirmed Material target. | Mandatory for Material targets. | Exclude universal claims about Material behavior; classify it as unverified. |
| `ux-design-intelligence` | knowledge | When judging visual consistency, product fit, hierarchy, interaction clarity, density, usability, or design-direction quality. | Mandatory for expert UX/visual judgment. | Use explicit project criteria and label the remaining judgment limited. |
| `token-writer` | working | Only if the user asks for a separate remediation after the audit baseline. | Optional, coordinated as a new workflow rather than an audit sub-step. | Leave remediation as a recommendation; do not mutate the audit baseline. |
| `design-coder` | working | Only if the user asks separately for prototype corrections after the audit. | Optional, coordinated as a new workflow rather than an audit sub-step. | Leave the confirmed issue and recommended fix for the responsible workflow. |

Knowledge skills are assessed by their own rules. The auditor does not invoke `design-designer` for a knowledge answer and does not create circular dependencies by asking an implementation skill to justify an audit finding. Post-audit remediation is a separate workflow when requested.

## Required scope

When called directly, inspect the repository before asking questions. Locate:

- `design-system/base-rules.md` and exceptions;
- `design-tokens.json`, generated `style.css`, and transformation tools;
- `components.md` and each component specification;
- HTML examples and component CSS;
- platform and framework configuration;
- existing design conventions and relevant approved references.

Ask only which subset to prioritize if the system is too large or ambiguous. Separate baseline audit from fixes. If asked to fix, preserve a clear baseline summary before changing anything.

## Expert audit method

### 1. Establish the acceptance model

Read approved project rules first, then platform and technical constraints, then applicable knowledge-skill standards. Record where project-specific choices intentionally differ and whether exceptions document them. Do not use an external preference to overrule a valid approved convention.

### 2. Evaluate system consistency

Check whether repeated roles use a coherent hierarchy and visual grammar: typography, color roles, spacing, borders, elevation, iconography, responsive behavior, and interaction feedback. Look for:

- duplicated semantic roles or competing visual treatments;
- undocumented one-off values or exceptions that escaped local scope;
- components that visually conflict with the approved direction;
- theme/platform variants that are incomplete or contradict each other;
- names that describe appearance while being used as semantic decisions.

### 3. Evaluate token usage and transformation

Apply `design-tokens-standard` to structure, types, references, and deprecations. Then evaluate actual usage: are components consuming suitable semantic custom properties, or bypassing the system with raw values? Distinguish format errors from design model problems and transformation limitations.

### 4. Evaluate component architecture

Inspect each component's specification, state table, HTML, CSS, and registry row together. Check:

- purpose, variants, and state coverage match the actual component;
- CSS-reproducible states use native CSS where sensible;
- static examples are correctly labeled and not misleading;
- functional behavior is documented but not simulated;
- semantics fit the role and do not rely on CSS class names for meaning;
- BEM or the documented alternative is scoped consistently;
- dependencies and exceptions are explicit;
- registry status is supported by evidence.

### 5. Evaluate accessibility and platform behavior

Apply `web-accessibility` as the mandatory WCAG 2.2 and APG foundation for every accessibility audit. On native projects, use relevant criteria as a baseline, but explicitly require separate evaluation of platform accessibility APIs, native semantics, focus and reading order, announcements, target sizes, scaling, gestures, and assistive technologies such as VoiceOver and TalkBack. Platform guidance skills describe platform UI conventions; they do not certify native accessibility.

Differentiate:

- statically confirmed defects, such as a control with no accessible text or an invalid ARIA relationship;
- potential issues that need runtime verification, such as focus order or announcement behavior;
- compliance gaps that cannot be verified from the available materials.

Never say a static prototype is keyboard or screen-reader accessible merely because CSS contains a focus selector. Never describe a web-based audit alone as complete native accessibility coverage or certification.

### 6. Evaluate UX and visual quality

Use `ux-design-intelligence` for product fit, hierarchy, interaction clarity, density, responsive priority, and inconsistencies not captured by mechanical rules. Recommend from evidence and approved direction, not personal taste. Explain the user impact and the tradeoff.

### 7. Use tools as evidence

If the project supplies a token validator, generator, contrast helper, or audit utility, run only the ones relevant to scope and inspect their implementations first. Treat their outputs as evidence:

- a passing check proves only its implemented assertion;
- an unavailable or failed execution is unverified or a tooling issue, never automatic compliance;
- a script cannot judge design intent, context, visual coherence, or runtime interaction.

The demo-only audit helper is `demo/design-system/scripts/audit-design-system.js` in the source repository. It exists to inspect the demo's static artifacts and demonstrate mechanical evidence; it is deliberately not part of `templates/project-template/design-system/scripts/` and is not required for expert auditing. Never make the audit dependent on that optional code.

## Finding classification

Report findings under exactly these four categories:

| Classification | Meaning | Evidence standard |
|---|---|---|
| **Confirmed violation** | A clear mismatch: broken rule, invalid semantics, invalid token structure, unsupported state claim, or noncompliant observable requirement. | Point to the artifact/rule/standard and explain the failure. |
| **Potential issue** | A credible risk that depends on context or runtime behavior. | Explain what to test and why it matters. |
| **Recommendation** | An improvement to usability, consistency, architecture, maintainability, or documentation. | Explain user/team benefit and tradeoff. |
| **Unverifiable** | The available static materials cannot establish the claim or condition. | State the missing evidence/method explicitly. |

Each finding also includes ID, severity, location, observation, explanation, recommended correction, and basis. Severity is `Critical`, `High`, `Medium`, `Low`, or `Info`. A recommendation does not become a violation merely because it is strongly preferred.

## Required report outline

1. Scope and evidence reviewed.
2. Executive judgment: is the system coherent and ready for the requested status?
3. Confirmed violations.
4. Potential issues.
5. Recommendations.
6. Unverifiable items and required manual tests.
7. Operational checks run and their limits.
8. Evidence-backed review-status recommendation.

For each reviewed component, state whether its registry status is supported. Do not recommend `Reviewed` while a significant confirmed violation is unresolved or a required manual check remains unknown.

## Quality criteria

- Findings distinguish evidence from inference and preference.
- Every claim directs the reader to a location and a concrete next action.
- Normative requirements, design guidance, and project conventions are not conflated.
- Cross-component and system-level issues are included, not just file-level syntax.
- Accessibility ceilings are honest; no script result is called an accessibility certification.
- Recommendations explain user or maintenance impact and remain actionable.
- Audit is read-only unless the user separately requests remediation.

## Output contract

Return a compact, expert report using the required categories and outline. End with a status recommendation: `ready for Reviewed`, `ready with documented caveats`, or `not ready`, with the reasons and remaining verification work.
