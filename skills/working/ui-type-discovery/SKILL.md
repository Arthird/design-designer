---
name: ui-type-discovery
description: Research and select framework-independent HTML/CSS renderers, component libraries, and platform-inspired visual systems for static design prototypes. Use when a project needs a specialized visual language, a UI-kit decision, or a rendering-plan revision; do not use for ordinary semantic HTML/CSS or for implementing the prototype.
metadata:
  short-description: Find and assess UI rendering systems
---

# UI Type Discovery

Investigate how a static design prototype can reproduce an approved visual language. Produce a verified rendering decision that `design-coder` can implement without turning the prototype into a framework-specific or production application.

Respond in the language the user uses. Keep artifact headings, technical identifiers, and source names in English unless the project has another documentation language.

Read [references/platform-catalog.md](references/platform-catalog.md) before starting a new search. Treat it as a dated set of leads, not a fixed allowlist.

For contributor-level acceptance checks, use the canonical [manual verification guide](https://github.com/Arthird/design-designer/blob/master/shared/workflow/manual-verification.md).

## Separation from other skills

- This is a working skill: it researches, writes the project rendering registry and plan, and recommends a handoff.
- It may consult knowledge skills, but it does not invoke another working skill.
- `design-designer` coordinates this skill before `$design-coder` when discovery is required.
- `design-coder` implements the approved plan and writes `rendering-report.md`.
- `design-auditor` evaluates the plan, implementation, dependencies, semantics, SVG use, and remaining limitations.

## Target platform and visual language

Treat these as separate decisions:

| Field | Meaning | Example |
|---|---|---|
| Target platform | Where the product or prototype will be encountered | Web |
| Visual language | Appearance and interaction cues the prototype should evoke | Windows 11 Fluent |

`Target platform: Web` with `Visual language: iOS` means a web prototype that uses iOS-inspired visual cues. It does not imply native iOS APIs, native navigation, or an Apple implementation. Load `apple-platform-guidance` or `material-platform-guidance` only when the actual product target needs native behavior or conventions; a visual-language resemblance alone does not trigger native implementation guidance.

## Dependencies and checkpoints

| Dependency | Type | Checkpoint and trigger | Mandatory? | If unavailable |
|---|---|---|---|---|
| `ux-design-intelligence` | knowledge | Before evaluating visual fit, hierarchy, density, or a materially ambiguous visual direction. | Mandatory for the visual-fit judgment. | Use approved project rules and label visual comparison as limited. |
| `web-ui-foundations` | knowledge | Before deciding whether a candidate is usable with semantic HTML and CSS in a static document. | Mandatory for HTML/CSS renderer decisions. | Report the technical suitability as unverified; do not infer it from the library name. |
| `web-accessibility` | knowledge | Before accepting a library or SVG strategy that affects names, focus, controls, contrast, reading order, or dynamic status. | Mandatory when accessibility suitability is part of the decision. | Mark accessibility suitability unverified and do not recommend the candidate as complete for the task. |
| `apple-platform-guidance` | knowledge | Only when the actual target is Apple and native behavior matters. | Conditional on a confirmed Apple target. | Keep native Apple behavior unresolved; visual-language resemblance alone does not require this skill. |
| `material-platform-guidance` | knowledge | Only when the actual target is Material/Android and native behavior matters. | Conditional on a confirmed Material target. | Keep native Material behavior unresolved; visual-language resemblance alone does not require this skill. |
| `design-coder` | handoff target | After the rendering plan is approved and implementation is requested. It is not invoked by this skill. | Conditional; coordinated by `design-designer` or the user. | Report the approved plan and handoff; do not implement the component here. |
| `design-auditor` | handoff target | After prototype implementation at the review gate. It is not invoked by this skill. | Conditional; coordinated by `design-designer` or the user. | Report the audit handoff; do not launch another working skill. |

## Inputs and reuse

When invoked directly, inspect before asking questions. Locate:

1. `design-system/base-rules.md` for approved visual direction, target platform, accessibility, and constraints.
2. `design-system/components.md` and target component specifications for required components and states.
3. `design-system/implementation-plan.md` for the requested scope.
4. Existing `design-system/rendering/library-registry.md` and `rendering-plan.md`.
5. Project dependency manifests, approved assets, and existing local libraries.

Ask only for a missing visual language, target platform, asset-rights constraint, or dependency decision that materially changes the recommendation. When direct invocation is not coordinated by `design-designer`, report the handoff to the user rather than invoking `design-coder`.

Reuse an existing rendering plan without repeating external research when all are true:

- its status is `Approved`;
- its visual language and target platform match the current request;
- its approved libraries and exact versions still match the project;
- it covers the required components and states, or explicitly permits the documented fallback;
- no user request, rule change, dependency change, or newly identified limitation invalidates it.

If only coverage is incomplete, extend the existing plan and preserve valid prior decisions. Re-run the candidate assessment when the visual language changes, a dependency version changes, a license changes, a plan is marked `Draft` or `Superseded`, or the existing evidence is insufficient.

## Research workflow

1. State the requested visual language, actual target platform, prototype boundary, required components, and constraints. Do not conflate the target platform with the visual reference.
2. Read the platform catalog and search for additional candidates, including projects absent from the catalog.
3. Prefer sources in this order: official project documentation, official GitHub repository, official site and component demonstrations, official releases/version information, reviewed real-world examples, then other sources as supporting evidence only.
4. Verify each serious candidate rather than judging by its name or screenshot. Check origin, repository status, latest relevant version/release, last meaningful activity, license, exact dependencies, framework and JavaScript requirements, build requirement, CSS delivery, theming, component coverage, browser support evidence, accessibility evidence, and feasibility as a static visual prototype.
5. Apply the current JavaScript policy. A third-party Web Component runtime is not automatically compatible with the no-custom-JavaScript prototype contract. A framework-specific kit cannot become the default framework-independent renderer. If a runtime-dependent option is genuinely preferable, record it as a separate gated proposal that the user must approve before it changes project constraints.
6. Compare viable candidates with the scorecard in the project registry. Apply critical gates before score: verified official source, clear license, exact version, compatible runtime, and lawful assets.
7. Select a rendering strategy. Prefer, in order: an existing suitable project dependency, an approved CSS-only or static HTML/CSS library, local approved resources, a pinned official CDN only when external loading is allowed and documented, then custom semantic HTML/CSS plus inline SVG for justified static visuals.
8. Record only useful, verified results. If no suitable kit exists, say so explicitly and select a custom static rendering fallback; do not force a weak or unrelated library.
9. Write `design-system/rendering/library-registry.md` and `rendering-plan.md` when discovery is required. Do not create an empty rendering subsystem for ordinary projects.
10. Ask for approval of the selected plan through the orchestrator or user. Keep the plan `Draft` until approved; use `Approved` only after explicit confirmation.
11. Hand the approved plan to `$design-coder` through `design-designer` or the user. Do not invoke `design-coder` from this skill.

## Candidate classification

Use exactly one decision status for each candidate:

| Status | Use when |
|---|---|
| `Recommended` | All critical facts are verified, the candidate fits the requested visual language, its runtime fits the approved project policy, and project-specific evidence supports it. |
| `Suitable with limitations` | It can work within the project if the named tradeoff, extra check, or approved runtime change is accepted. |
| `Reference only` | It helps study the visual system but is not a suitable implementation dependency. |
| `Rejected` | A verified conflict makes it unsuitable for the current workflow. |
| `Not verified` | Required facts, official sources, license, runtime, or suitability are not established. |

Never label a library `Recommended` because its screenshots look close. License, origin, exact version, implementation type, and static viability are mandatory evidence. Record missing evidence as `Not verified`.

## Comparison scorecard

Score each criterion from 0 to 2 and state the evidence:

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| Visual-language fit | Unknown or unrelated | Partial or needs heavy redesign | Directly supports the requested language |
| Framework independence | Framework-only | Possible but awkward outside its ecosystem | Ordinary HTML or static CSS |
| JavaScript runtime | Required and incompatible with policy | Optional but needed for key examples | No runtime needed for the selected use |
| Component coverage | Required components absent | Partial coverage | Covers the requested set |
| Visual fidelity | Not demonstrated | Plausible, not verified | Checked against a demonstration or specification |
| Token compatibility | Conflicts or cannot be adapted | Adaptable with broad overrides | Maps cleanly or can be scoped |
| Customization | Not practical | Possible with substantial work | Documented and reasonably scoped |
| Accessibility evidence | None or conflicting claim | Partial or unverified | Relevant semantics and limitations are documented |
| Responsive behavior | Not suitable | Requires custom adaptation | Documented static adaptation is feasible |
| Maintenance | Abandoned with no viable use | Archived or stale but still usable | Active or deliberately feature-complete |
| Documentation | Insufficient | Basic | Clear installation, components, and constraints |
| License clarity | Missing or incompatible | Needs project-specific review | Clear and compatible |

The score informs comparison; it does not override a failed mandatory gate. Record the rationale for each adjustment that changes the status.

## Project rendering artifacts

Create the rendering subsystem only when a specialized visual language, external renderer, or nontrivial SVG strategy requires a documented decision:

```text
design-system/
└── rendering/
    ├── library-registry.md
    ├── rendering-plan.md
    └── rendering-report.md
```

This skill owns the first two files. `design-coder` owns `rendering-report.md`.

### library-registry.md

Record project-specific verified candidates, not an unfiltered link collection. For each candidate include:

| Field | Required content |
|---|---|
| Library / source | Exact name and publisher |
| Visual language | Platform-like style, not an asserted native target |
| Official URL | Documentation or project site |
| Repository | Official source repository |
| Version | Exact selected version or designated task revision |
| License | SPDX identifier or precise reviewed terms |
| Implementation type | `CSS-only`, `HTML/CSS snippets`, `Web Components`, `Framework-specific`, `Design reference`, or `Assets only` |
| Dependencies | CSS, JavaScript, build tooling, fonts, assets |
| JavaScript runtime | Required, optional, or not used for the selected scope |
| Coverage | Components and states supported for this task |
| Verification | Official sources, demonstration, and tests performed |
| Last checked | ISO date |
| Limitations | Runtime, licensing, accessibility, browser, visual, or maintenance constraints |
| Decision | One of the five candidate statuses |
| Score | Criteria scores and concise rationale |

### rendering-plan.md

Write a concrete plan with these fields:

- `Status`: `Draft`, `Approved`, or `Superseded`;
- visual language and actual target platform;
- primary library or explicit custom strategy;
- approved exact versions, official sources, and licenses;
- component-to-renderer priorities;
- JavaScript and dependency policy;
- token and CSS isolation strategy;
- accessibility checks and unverifiable behavior;
- asset-rights notes;
- known limitations;
- approval evidence.

Use `references/platform-catalog.md` for the stable field pattern and the starter candidate inventory.

## Safety and dependency rules

- Do not install, download, copy, or add a dependency merely because it was found. Show the user its name, version, official source, license, runtime dependencies, reason, and limitations before a project dependency changes.
- Do not use `latest` in a prototype URL. Require an exact version or immutable reference.
- Do not copy external code or assets until the license and distribution conditions are verified.
- Do not use proprietary logos, screenshots, fonts, icons, sounds, or platform artwork without confirmed usage rights. A recreation based on documented patterns may use original assets and inline SVG.
- Do not promise native behavior or platform API compatibility from a visual resemblance.
- Do not hide unsupported components behind a claim that the library covers them.

## Output contract

Report the visual language, actual target platform, reuse or research action, verified candidates, selected strategy, exact dependencies, artifacts written, approval state, unresolved evidence, and handoff to `$design-coder` through the orchestrator/user. End with an honest statement such as: `Discovery complete: rendering plan drafted; browser, accessibility, and runtime-dependent behavior remain unverified.` Never implement or audit the prototype in this skill.
