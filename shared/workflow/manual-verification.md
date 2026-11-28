# Manual Functional Verification

This repository has no automated test framework. Verify the skills through focused manual exercises with disposable project workspaces. Do not add a replacement test runner, CI test matrix, or fixture suite merely to complete these checks.

Use disposable local copies while preparing release changes. After publication, run the installation checks against the new release tag and confirm that `ui-type-discovery` is included. Use the tag recorded in the GitHub Release and in the README version block.

## Standard verification sequence

1. Run `npx skills@latest add Arthird/design-designer@<release-tag> --list` and confirm the working and knowledge skills are discoverable.
2. Install the complete set into a temporary project with `npx skills@latest add Arthird/design-designer@<release-tag> --skill '*' -a codex -y`.
3. Invoke the orchestrator in a realistic project request and confirm it inspects first, then invokes dependencies at their documented checkpoints.
4. Invoke each working skill directly and confirm it asks only for missing context and remains within its scope.
5. Invoke each knowledge skill directly and confirm it returns criteria or decisions rather than executing changes.
6. Exercise optional-integration absence and a token conflict; verify explicit fallback and risk recording.
7. Run `npx skills@latest update -p -y` and verify it updates at the recorded source/ref. Separately verify that moving to a new release uses an explicit pinned installation.
8. Extract the template from the same release tag with the documented Giget command and confirm it creates `designed-design/project-template`, not a project-named copy directly under `designed-design`.
9. Invoke `design-designer` from the wrapper and confirm it either asks for the intended project root or selects `designed-design/project-template`; verify `design-system/` is created only below that starter, never beside it.
10. Run `npm ci` and `npm run release:test`, then confirm the temporary release tests produce the expected `chore(release): 1.0.1 [skip ci]` commit and `v1.0.1` tag without changing the repository.

## Orchestrator dependency and checkpoint checks

These checks are distinct to the `design-designer` coordinator:

- Confirm `ux-design-intelligence`, `design-tokens-standard`, and every relevant web or platform knowledge skill are discoverable before the phase that needs them.
- Confirm optional `ui-ux-pro-max` is inspected by exact name only when present.
- Confirm the orchestrator does not claim a knowledge source was used when it is absent or was not consulted.
- In a disposable React workspace, ask for a responsive dashboard design system and verify project inspection, web requirements, direction/rules gates, and stage-appropriate delegation to `token-writer`, `design-coder`, and `design-auditor`.
- Confirm no JavaScript or production behavior appears in visual examples.
- In an iOS workspace, verify the orchestrator selects `apple-platform-guidance` after confirming the target, does not impose web HTML/CSS behavior on native interaction, and keeps native runtime verification explicit.
- Remove an optional knowledge skill and confirm the explicit fallback or incomplete-review report.
- Make a token standard or tool unavailable and confirm token authoring stops rather than inventing syntax.
- Record an accessibility-conflicting user decision and confirm it is documented in `exceptions.md` rather than called compliant.
- Omit a component specification and confirm prototyping does not proceed using fabricated requirements.
- Confirm a `skills update` operation is not described as a transition between release tags; explicitly installing a new pinned tag is the release-switch check.

## Workflow scenarios

### Direct UI type discovery

Invoke `$ui-type-discovery` for a Windows 11-inspired static web prototype. Confirm that it separates `Target platform: Web` from `Visual language: Windows 11 Fluent`, inspects project rules before searching, verifies official source and license information, records exact versions and runtime requirements, and writes `library-registry.md` and `rendering-plan.md` only when needed. It must not implement components or claim that Fluent UI is automatically usable without its JavaScript runtime decision.

Repeat for macOS/iOS, terminal, Windows 98/retro, and PlayStation or Xbox visual languages. Confirm that a narrow starter catalog does not stop the search, that missing mature kits are reported explicitly, and that proprietary assets are not copied without confirmed rights.

For PlayStation or Xbox, confirm that an unverified community project is classified honestly. If no suitable library is verified, the result should explicitly select custom semantic HTML/CSS plus inline SVG rather than misrepresent an unrelated kit as native or complete.

### New web design system

Given an existing React project with no design-system directory, ask for a responsive account dashboard. Confirm that the orchestrator:

- inspects the repository before questions;
- confirms web targets and the prototype/production boundary;
- checks `ux-design-intelligence` and optional UI UX Pro Max availability;
- obtains direction and rules review;
- consults token, accessibility, web-foundation, and BEM knowledge at their gate points;
- delegates token authoring and prototyping to the relevant working skills;
- audits before using `Reviewed`.

### Native platform

Given an iOS project and no web UI, ask for a component system. Confirm that the orchestrator selects `apple-platform-guidance`, does not impose HTML/CSS rules, and leaves runtime verification unresolved where static artifacts cannot prove it.

For native accessibility, confirm that the workflow uses WCAG 2.2 and APG as a baseline, then requires separate evaluation of platform accessibility APIs, semantics, focus/reading order, announcements, target sizes, scaling, gestures, and VoiceOver/TalkBack behavior. A web-oriented audit must not be described as complete native accessibility coverage or certification.

### Existing design system

Given existing tokens, CSS variables, and established component names, ask to add one variant. Confirm that the workflow extends the established conventions, records only a justified local exception, and does not create a parallel source of truth.

### Direct design-coder invocation

Ask for a loading disclosure without a complete component spec. Confirm that the skill inspects first, requests or drafts only the missing spec, uses static HTML/CSS without JavaScript, and distinguishes visual state from production behavior. Without a specialized visual language, it should proceed without requiring `ui-type-discovery`.

With an approved CSS-only UI kit and rendering plan, confirm that it follows official loading guidance, pins the version, maps approved tokens where practical, and records usage in `rendering-report.md` and `component.md`.

With a platform-specific static control that has no suitable library component, confirm that it uses embedded SVG with `viewBox`, meaningful structure, and correct informative/decorative accessibility treatment. Confirm that a separate example replaces an actual `<button>`, link, field, checkbox, select, or other interactive control with an SVG drawing and is treated as a defect.

Confirm that no custom JavaScript, fake form submission, fake navigation, data loading, or application state appears. Confirm that framework-specific React/Vue/Angular code is not used as the default renderer, and that a third-party dependency is not added without explicit approval and recorded source, version, license, runtime, and limitation.

### Direct token-writer invocation

Request a muted text token whose proposed color fails contrast. Confirm that the skill consults applicable knowledge, explains the risk, asks for an intentional decision, records the approved exception or changes the value, and regenerates CSS deterministically.

### Direct design-auditor invocation

Supply a design system with a missing component directory, an incomplete accessibility section, and a static prototype. Confirm that the auditor reports confirmed violations, potential issues, recommendations, and unverifiable runtime claims separately. It must not treat a mechanical check as a certification.

### Knowledge-skill direct invocation

Ask `design-tokens-standard` a token-model question and `web-accessibility` a contrast/focus question. Confirm each returns criteria and decision rules without editing project files or claiming it performed a workflow.

### Rendering plan reuse and full orchestration

- Invoke `$ui-type-discovery` again with an unchanged approved plan and confirm that it reuses the plan without repeating external research unless the visual language, versions, dependencies, scope, or evidence changed.
- Request a plain framework-independent web dashboard with no specialized visual language. Confirm that `design-designer` does not call `ui-type-discovery` merely because `design-coder` will be used.
- Request a specialized visual language. Confirm the full order: `design-designer` → `ui-type-discovery` → approved `rendering-plan.md` → `design-coder` → `rendering-report.md` → `design-auditor`. Confirm that no working skill directly launches another working skill and no cycle exists.

## Failure handling

- If UI UX Pro Max is unavailable, the orchestrator must state that database-backed design intelligence is unavailable and use the fallback criteria.
- If a knowledge dependency is absent, follow the working skill's dependency table. Do not fabricate normative advice.
- If a script is absent, use an inspected project equivalent where allowed; otherwise report the block. Do not substitute generated-looking CSS or a fabricated validation pass.
- If a user chooses a conflicting design, state the applicable requirement and record the accepted deviation; do not declare compliance.

## Evidence to retain

Arbitrary prose matching is not the acceptance target. Retain observable evidence:

- installed skill names and installation scope;
- files created or changed in the disposable project;
- visible source of each knowledge dependency used;
- actual validator/generator commands and their output;
- unresolved manual checks and accepted risks.
