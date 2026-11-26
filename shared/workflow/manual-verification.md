# Manual Functional Verification

This repository has no automated test framework. Verify the skills through focused manual exercises with disposable project workspaces. Do not add a replacement test runner, CI test matrix, or fixture suite merely to complete these checks.

## Standard verification sequence

1. Run `npx skills add Arthird/design-designer --list` and confirm the working and knowledge skills are discoverable.
2. Install all skills into a temporary project with `npx skills@latest add Arthird/design-designer --all -y`.
3. Invoke the orchestrator in a realistic project request and confirm it inspects first, then invokes dependencies at their documented checkpoints.
4. Invoke each working skill directly and confirm it asks only for missing context and remains within its scope.
5. Invoke each knowledge skill directly and confirm it returns criteria or decisions rather than executing changes.
6. Exercise optional-integration absence and a token conflict; verify explicit fallback and risk recording.
7. Update the installed skills and verify the source and selected scope remain as documented.

## Workflow scenarios

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

### Existing design system

Given existing tokens, CSS variables, and established component names, ask to add one variant. Confirm that the workflow extends the established conventions, records only a justified local exception, and does not create a parallel source of truth.

### Direct design-coder invocation

Ask for a loading disclosure without a complete component spec. Confirm that the skill inspects first, requests or drafts only the missing spec, uses static HTML/CSS without JavaScript, and distinguishes visual state from production behavior.

### Direct token-writer invocation

Request a muted text token whose proposed color fails contrast. Confirm that the skill consults applicable knowledge, explains the risk, asks for an intentional decision, records the approved exception or changes the value, and regenerates CSS deterministically.

### Direct design-auditor invocation

Supply a design system with a missing component directory, an incomplete accessibility section, and a static prototype. Confirm that the auditor reports confirmed violations, potential issues, recommendations, and unverifiable runtime claims separately. It must not treat a mechanical check as a certification.

### Knowledge-skill direct invocation

Ask `design-tokens-standard` a token-model question and `web-accessibility` a contrast/focus question. Confirm each returns criteria and decision rules without editing project files or claiming it performed a workflow.

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
