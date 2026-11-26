# Versioning and Compatibility

## Release sets

The repository uses semantic version tags. Skills in one release form a tested, compatible set. Use the repository release, not individual skill versions, as the compatibility unit.

The current documented release is `v2.0.0`. Do not add per-skill version metadata or a compatibility matrix unless a future release introduces a concrete incompatibility that this release-set model cannot express.

## Installation and updates

Install the complete set from the release you intend to use:

```bash
npx skills@latest add Arthird/design-designer@v2.0.0 --skill '*' -a codex -y
```

The recommended update path is to update the complete installed set to one release:

```bash
npx skills@latest update -p -y
```

Do not recommend updating individual skills independently in normal operation. If a deliberate subset is installed, reinstall the complete selected subset from one release instead of mixing versions. The CLI can target individual skills, but that capability is not the repository's compatibility policy.

The project template must come from the same release as the skills:

```bash
npx giget@latest gh:Arthird/design-designer/templates/project-template#v2.0.0 designed-design
```

The Skills CLI records the requested release ref and resolved commit in `skills-lock.json`. Giget has no comparable lock, so record or verify the template source tag when maintaining a project.

## Semantic version changes

- **Patch:** documentation corrections, examples, and non-behavioral clarifications.
- **Minor:** compatible new skills, capabilities, or rules.
- **Major:** renamed/moved skills, removed dependencies, incompatible workflow or output contracts, or an architecture change.

Update every affected dependency table and the documentation together before tagging a release. Published tags and release notes are the package history; there is no root changelog.

## Supported environment

- **Skills CLI:** verified with v1.9.0; use `npx skills@latest` for current compatible releases.
- **Giget:** verified with v3.3.1 for pinned template extraction; use `npx giget@latest` for current compatible releases.
- **Codex:** supported through the Skills CLI's Codex target and project/global `.agents/skills/` location.
- **Node.js:** Skills CLI currently requires Node.js 22.20 or later. The project token tools use Node.js built-ins.
- **Network:** installation, template acquisition, and updates require access to GitHub and npm.

## Release checklist

1. Perform the applicable manual checks in `shared/workflow/manual-verification.md`.
2. Check each affected knowledge skill's primary source, revision, and last-checked date.
3. Confirm `npx skills@latest add Arthird/design-designer --list` discovers every installable skill.
4. Install the complete set and verify update behavior from the release.
5. Extract the template from the same release into a new directory and verify its project structure.
6. Update documentation and dependency declarations before tagging.
7. Tag the release; do not create a root changelog.
