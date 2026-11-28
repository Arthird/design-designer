# Agent Instructions

This repository is an installable Codex skill ecosystem for creating,
documenting, validating, and visually prototyping project design systems.
Skill instructions and repository documentation are written in English;
respond to users in their language.

## Work from evidence

- Inspect the repository, project instructions, skills, templates, and current
  Git state before changing files.
- Ask only for information that the files and conversation do not provide.
- Preserve existing user changes and approved project decisions.
- Record assumptions as assumptions. Do not invent requirements, approvals,
  source evidence, test results, or completed manual checks.
- Stop or report a blocker when a mandatory authority, dependency, or artifact
  is unavailable and no documented fallback applies.

## Preserve the architecture

- Working skills execute tasks. Knowledge skills provide rules and decision
  criteria. `design-designer` coordinates working-skill handoffs.
- Keep the dependency graph acyclic. Knowledge skills never invoke working
  skills, and working skills do not launch one another.
- Do not duplicate detailed subskill instructions in the orchestrator.
- Consult a working skill's exact `SKILL.md` before relying on it.
- Never copy, modify, or redistribute the optional external
  `ui-ux-pro-max` skill. Do not claim it was used unless it was inspected.
- Keep `SKILL.md`, `agents/openai.yaml`, references, documentation, templates,
  and the demo consistent with any behavior change.

## Respect project and prototype boundaries

- Establish target platforms, frameworks, constraints, and existing
  conventions per project. Never assume a web target.
- Extend an existing design system unless replacement is explicitly approved
  and migration impact is documented.
- Keep the actual target platform distinct from a visual language.
- Produce static HTML/CSS/SVG visual prototypes only. Do not add application
  JavaScript, application state, data loading, fake navigation, or fake form
  submission.
- Keep interactive controls as semantic HTML elements. SVG may decorate a
  control but must not replace its semantics, focus, or accessible name.
- Use an approved pinned renderer when required. Do not use `latest` URLs,
  add dependencies, or copy external assets without the required approval and
  recorded source, version, license, runtime, and limitations.
- Explain conflicts with accessibility, standards, or platform guidance and
  ask before proceeding with a deliberate deviation. Record accepted risks;
  approval does not turn a violation into compliance.

## Preserve artifact ownership

- `design-designer` owns discovery, decisions, review gates, coordination, and
  project history.
- `ui-type-discovery` owns renderer research and the rendering registry/plan.
- `design-coder` owns static prototype examples, component CSS, and the
  rendering report.
- `design-auditor` owns independent review; baseline audits do not implement
  remediation.
- `token-writer` owns `design-tokens.json` and token generation.
- Never hand-edit generated `style.css`. Change the token source or generator
  template, then run the documented deterministic generator.

## Follow the workflow gates

- Inspect first, then establish requirements and the approved visual direction.
- Review design rules before token authoring.
- Approve component specifications and the applicable rendering decision
  before prototyping.
- Run the project token validator and CSS generator after token changes.
- Audit after tokens, initial specifications, prototypes, and before using
  `Reviewed`.
- Keep component statuses consistent with evidence. A completed visual
  prototype is not a production implementation.
- Update `design-system/changelog.md` for meaningful project-level design
  changes. Do not add a repository-root changelog; Git tags and release notes
  are package history.

## Release and verification rules

- Treat a complete repository release as the compatibility unit. Use skills
  and the project template from the same pinned tag; never mix releases.
- Keep installation, update, template, version, and manual-verification
  instructions synchronized.
- Follow the canonical [manual verification guide](shared/workflow/manual-verification.md).
  Do not add a test framework, CI matrix, or fixture suite as a substitute for
  its manual scenarios.
- Report automated checks as limited evidence. Do not claim runtime keyboard,
  screen-reader, native-device, or accessibility certification from static
  files.
- Before finishing, verify changed manifests, local Markdown links, token
  results, generated-output freshness, and the applicable manual scenarios.
- When a knowledge domain changes, review its source metadata under the
  [source freshness policy](shared/SOURCE-FRESHNESS.md).

## Commit conventions

- Follow the repository's Conventional Commit style. Use `feat` for a
  user-visible capability, `fix` for a defect, `perf` for a performance
  improvement, `revert` for a reversal, `docs` for documentation, `test` for
  tests, `ci` for automation, `chore` for maintenance, and `refactor` for a
  behavior-preserving code change.
- Keep one logical change per commit. Split unrelated fixes, features,
  refactors, documentation, and generated artifacts into separate commits.
- Stage explicit paths or hunks. Do not use `git add -A`, and do not include
  unrelated user changes. Read the staged diff before committing.
- Use an imperative lowercase subject without a trailing period. Add a body
  only when the motivation, migration impact, or non-obvious tradeoff is not
  clear from the diff.
- Mark incompatible changes with `!` before the colon and a
  `BREAKING CHANGE:` footer that states the migration. A breaking change
  requires a MAJOR release.
- Do not add AI, co-author, signed-off, reviewed-by, or generated-by
  attribution unless the user explicitly requests it.
- Run the applicable validators before committing. Never claim a check passed
  unless its command actually ran successfully.
- Do not manually tag or publish a release after pushing to `master` or
  `main`; the release workflow owns version selection, tags, release notes,
  and GitHub Releases.
- Do not edit or revert `chore(release): <version> [skip ci]` commits by hand.
  They update the managed version references and become the next release
  baseline.
- If a push is rejected because the release workflow created a commit, fetch
  and rebase the unpublished local commits onto the updated branch. Never
  force-push a release branch.

## Keep changes reviewable

- Make the smallest coherent change that satisfies the request and avoid
  unrelated refactors or documentation duplication.
- In the final response, state what changed, which checks were actually run,
  and any remaining limitations or unverified behavior.
