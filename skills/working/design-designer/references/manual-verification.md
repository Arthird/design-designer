# Orchestrator Manual Verification

Use these checks after changes to the orchestrator or its dependencies. They are acceptance exercises, not an automated test suite.

## Dependency discovery

- Confirm `ux-design-intelligence`, `design-tokens-standard`, and the relevant web or platform knowledge skills are discoverable before the phases that need them.
- Confirm optional `ui-ux-pro-max` is inspected by exact name only when present.
- Do not claim a knowledge source was used if it is absent or was not consulted.

## Web workflow

In a disposable React workspace with no design-system folder:

1. Ask for a responsive dashboard design system.
2. Verify the skill inspects files before questioning.
3. Verify it proposes web requirements and chooses the web knowledge modules.
4. Verify direction and rules checkpoints happen before token changes.
5. Verify `token-writer`, `design-coder`, and `design-auditor` are invoked at their defined stages.
6. Verify no JavaScript or production behavior is added to visual examples.

## Native workflow

In an iOS workspace:

1. Ask for a design-system proposal.
2. Verify the orchestrator discovers `apple-platform-guidance` after confirming the target.
3. Verify it does not apply web HTML/CSS conventions to native interaction.
4. Verify runtime-native verification remains an explicit manual item.

## Failure paths

- Remove an optional knowledge skill: confirm explicit fallback or incomplete-review reporting.
- Simulate an unavailable token standard or tool: confirm the orchestrator stops token authoring rather than inventing syntax.
- Record an accessibility-conflicting user decision: confirm it appears in `exceptions.md` and is not called compliant.
- Omit a component specification: confirm prototyping does not proceed by fabricated requirements.
