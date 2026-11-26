# Versioning and Compatibility

## Repository version

The repository uses semantic versions in Git tags and GitHub releases. The current architecture is version 2.0.0 because it reorganized installable skills, separated working and knowledge domains, and changed installation to the Skills CLI.

Do not add version metadata to every skill. The repository release is the compatibility unit. Published tags and release notes are the authoritative package history; there is no root changelog.

## Individual skills

- Preserve public skill names unless a rename is unavoidable and explicitly released as a breaking change.
- A working skill has its own focused responsibility. Internal changes that do not affect invocation or dependencies may ship in a patch release.
- A knowledge skill owns one domain and one primary source of truth. A decision-rule change may ship in a patch or minor release depending on whether it changes expected working-skill behavior.
- Avoid introducing a second source of truth. If multiple knowledge skills are affected, update each at its own source and keep precedence explicit.

## Compatibility declarations

Use normal semantic-version ranges when a working skill genuinely depends on a specific knowledge-skill interface:

| Change | Semver effect |
|---|---|
| Documentation or example clarification only | Patch |
| New optional skill, capability, field, or compatible rule | Minor |
| Renamed/moved skill, removed dependency, incompatible workflow or output contract | Major |

The active dependency tables in `design-designer`, `design-coder`, `design-auditor`, and `token-writer` list exact skill names, checkpoints, and fallback behavior. A release that changes those names or required checkpoints must update every affected dependency table consistently and document the migration in the release notes.

## Supported environment

- **Skills CLI:** v1.9.0 was used to verify discovery and installation; use `npx skills@latest` for current compatible releases.
- **Codex:** supported through the Skills CLI's Codex target and project/global `.agents/skills/` location.
- **Node.js:** Skills CLI currently requires Node.js 22.20 or later. Project token tools use Node.js built-ins and have been exercised with Node.js v24.
- **Network:** installation and updates require access to the repository source and npm registry.

CLI and agent support can change independently of these skills. Verify the official Skills CLI documentation before documenting a newly observed incompatibility.

## Release checklist

1. Manually exercise the affected workflows, dependencies, and fallbacks from `shared/workflow/manual-verification.md`.
2. Check each affected knowledge skill's primary source, revision, and last-checked date.
3. Confirm `npx skills add Arthird/design-designer --list` discovers every installable skill.
4. Install all, individual, and selected skill groups into a disposable workspace.
5. Update documentation and compatibility statements before tagging.
6. Tag and release using the chosen semantic version; do not create a root changelog.
