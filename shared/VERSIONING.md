# Versioning and Compatibility

## Release sets

The repository uses semantic version tags. Skills in one release form a tested, compatible set. Use the repository release, not individual skill versions, as the compatibility unit.

[@README.md#L7:9](file:///home/tema/projects/skills/design-designer/README.md#L7:9)

<context ref="file:///home/tema/projects/skills/design-designer/README.md#L7:9">
<!-- VERSION:START -->
**Current version:** v2.2.1
<!-- VERSION:END -->

</context>

`v2.1.1` was a patch release that corrected release installation guidance. `v2.1.0` introduced the `ui-type-discovery` working skill and the HTML/CSS/inline-SVG rendering workflow without changing existing skill names or output contracts. Published tags remain immutable. Do not add per-skill version metadata or a compatibility matrix unless a future release introduces a concrete incompatibility that this release-set model cannot express.

## Automated releases

`.github/workflows/release.yml` runs on pushes to `master` or `main`, and on manual dispatch. The repository's actual default branch is `master`; keep `main` in the configuration only while a branch rename is being completed. A fixed concurrency group serializes release runs and prevents concurrent tags or release commits.

The workflow checks out the complete history, installs the pinned tools in `package-lock.json`, runs `npm run release:test` and the design-system token checks, then runs `semantic-release`. The release-tool test also exercises the update, release-commit, and tag handoff against a temporary local remote. A failed check stops the release before a tag or GitHub Release is created.

`semantic-release` reads the latest reachable release tag and the commits since that tag. It applies the release rules in `scripts/release-rules.cjs`:

| Commit | Release |
| --- | --- |
| `BREAKING CHANGE:` footer, or `!` before `:` | MAJOR |
| `feat:` | MINOR |
| `fix:`, `perf:`, `revert:` | PATCH |
| `docs:`, `test:`, `ci:`, `chore:`, `refactor:` | No release |

When several commits are eligible, the highest release type wins. Unconventional commit messages are ignored for release selection. A release commit uses `chore(release): <version> [skip ci]` and is not analyzed as a version change because `chore` does not release and the resulting tag becomes the next baseline.

`@semantic-release/exec` runs `scripts/update-version.js` before `@semantic-release/git` commits these files:

- the block between `<!-- VERSION:START -->` and `<!-- VERSION:END -->` in `README.md`;
- the README source-fragment blocks in this file, `shared/workflow/manual-verification.md`, `skills/working/README.md`, and `skills/knowledge/README.md`;
- `VERSION`, when present;
- the `version` field in `version.json`, when present.

The version updater preserves all content outside the managed blocks and is idempotent. Each source-fragment block must include the `README.md#L7:9` link and its matching `<context>` block. To support another document, add it to `VERSION_CONTEXT_FILES` in `scripts/update-version.js`, include it in the same `@semantic-release/git` assets array, and extend `scripts/test-release-tools.js` before releasing.

### GitHub configuration

1. Set repository **Settings → Actions → General → Workflow permissions** to allow read and write access for workflows, or retain the repository default of read and let the workflow's explicit `permissions: contents: write` request elevate it.
2. Keep the workflow permission minimal: only `contents: write` is required for release commits, tags, and GitHub Releases. The workflow declares no extra permissions.
3. Allow GitHub Actions to create releases. No personal access token is required when the default `GITHUB_TOKEN` has `contents: write`; keep `GH_TOKEN` unset so the plugin cannot select a different credential.
4. If `master` or `main` is protected, configure a release bypass or ruleset exception for the release workflow identity. A normal `GITHUB_TOKEN` push is rejected when branch protection does not allow that actor; document and review any bypass because it permits workflow-side writes to the release branch.
5. Do not store the token in a repository secret. Use the automatic `secrets.GITHUB_TOKEN` already supplied by GitHub Actions.

### Conventional Commit examples

```text
fix(parser): reject unresolved token aliases
feat(rendering): support static console controls
perf(audit): avoid duplicate file reads
revert: undo the experimental renderer preset

feat(api)!: remove the legacy workflow contract

BREAKING CHANGE: callers must install the complete skill set.
```

The title of a GitHub PR is what survives a **Squash and merge** as the default commit subject. Use a Conventional Commit title and put any breaking-change footer in the PR body if the squash message should retain it. A conventional PR title is required; a non-conventional squash title produces no automatic release for that commit.

### Initialization

The repository already has a baseline release tag. For another repository, create or choose the first baseline tag before enabling automation. Without a reachable release tag, `semantic-release` starts from `1.0.0`; do not create or move a tag that already exists.

```bash
git fetch --tags
git tag -l 'v*' --sort=-version:refname | head -1
```

Then commit the release configuration, install with `npm ci`, and run `npm run release:test`. Push the configuration to the release branch only when the first release should be evaluated for real.

### Release test

Test without publishing from a disposable clone with a valid GitHub token and a Conventional Commit since the latest tag:

```bash
npm ci
npm run release:test
GITHUB_TOKEN="<token with contents:write>" npx semantic-release --dry-run --no-ci
```

The dry run validates configuration, history, and the next version but does not create a tag or GitHub Release. Do not use the dry run as proof of branch-protection bypass. After merging a `feat:` or `fix:` commit, verify the Release workflow, the new tag, the `chore(release): <version> [skip ci]` commit, every managed version context, and the GitHub Release notes.

## Installation and updates

Install the complete set from the current release:

```bash
npx skills@latest add Arthird/design-designer@v2.2.0 --skill '*' -a codex -y
```

The command uses the current stable release tag.

The standard update command refreshes installed skills at their recorded source and ref. It does not select a new repository release:

```bash
npx skills@latest update -p -y
```

To select a release explicitly, install the complete set from its tag:

```bash
npx skills@latest add Arthird/design-designer@v2.2.0 --skill '*' -a codex -y
```

Use `-g` instead of `-p` for global scope when appropriate. The release tag determines the installed version. All skills in a release should come from the same tag. Reinstalling may overwrite installed skill copies; preserve and review local modifications before replacement. Do not recommend updating arbitrary individual skills independently. If a deliberate subset is installed, reinstall the complete selected subset from one release instead of mixing versions.

The project template must come from the same release as the skills:

```bash
npx giget@latest gh:Arthird/design-designer/templates#v2.2.0 designed-design
```

Use the same tag as the installed skills.

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
3. Confirm `npx skills@latest add Arthird/design-designer@v2.2.0 --list` discovers every installable skill.
4. Install the complete set from the candidate tag and verify recorded-ref update behavior separately from release switching.
5. Extract the template from the same candidate release into a new directory and verify its project structure.
6. Update documentation and dependency declarations before tagging.
7. Tag the release; do not create a root changelog.
