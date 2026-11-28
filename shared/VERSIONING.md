# Versioning and Compatibility

## Release sets

The repository uses semantic version tags. Skills in one release form a tested, compatible set. Use the repository release, not individual skill versions, as the compatibility unit.

The current documented release is `v2.1.0`, a minor release that adds the `ui-type-discovery` working skill and the HTML/CSS/inline-SVG rendering workflow. The additions preserve existing skill names, dependencies, and output contracts. `v2.0.2`, `v2.0.1`, and `v2.0.0` remain immutable earlier releases. Do not add per-skill version metadata or a compatibility matrix unless a future release introduces a concrete incompatibility that this release-set model cannot express.

## Installation and updates

Install the complete set from the release you intend to use:

```bash
npx skills@latest add Arthird/design-designer@v2.1.0 --skill '*' -a codex -y
```

The standard update command refreshes installed skills at their recorded source and ref. It does not select a new repository release:

```bash
npx skills@latest update -p -y
```

To move an installation to `v2.1.0`, explicitly install the complete set from that tag:

```bash
npx skills@latest add Arthird/design-designer@v2.1.0 --skill '*' -a codex -y
```

Use `-g` instead of `-p` for global scope when appropriate. The release tag determines the installed version. All skills in a release should come from the same tag. Reinstalling may overwrite installed skill copies; preserve and review local modifications before replacement. Do not recommend updating arbitrary individual skills independently. If a deliberate subset is installed, reinstall the complete selected subset from one release instead of mixing versions.

The project template must come from the same release as the skills:

```bash
npx giget@latest gh:Arthird/design-designer/templates#v2.1.0 designed-design
```

The destination name identifies the wrapper, while the extracted project starter remains at `designed-design/project-template`. Run `design-designer` with that starter as the project root so generated artifacts are placed in `designed-design/project-template/design-system`.

The Skills CLI records the requested release ref and resolved commit in `skills-lock.json`. Giget has no comparable lock, so record or verify the template source tag when maintaining a project.

## Semantic version changes

- **Patch:** documentation corrections, examples, non-behavioral clarifications, and backward-compatible fixes to installation instructions or skill behavior.
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
3. Confirm `npx skills@latest add Arthird/design-designer@v2.1.0 --list` discovers every installable skill.
4. Install the complete set from the candidate tag and verify recorded-ref update behavior separately from release switching.
5. Extract the template from the same release into a new directory and verify its project structure.
6. Update documentation and dependency declarations before tagging.
7. Tag the release; do not create a root changelog.
