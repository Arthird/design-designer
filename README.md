# Design Designer Skill Ecosystem

An installable Codex skill ecosystem for designing, documenting, validating, and visually prototyping a project-specific design system.

The repository separates **working skills**, which execute tasks, from **knowledge skills**, which supply authoritative domain rules and decision criteria. The result can be installed as a complete group, as selected working or knowledge groups, or as individual skills.

## Install with Skills CLI

The supported installation interface is [`npx skills@latest add`](https://github.com/vercel-labs/skills). Current CLI version at documentation time is **1.9.0**; Node.js **22.20 or newer** is required for the CLI. Use `npx skills@latest --help` to inspect the installed version's options.

Run these commands from the project where you want the skills available. Omitting `-g` installs at project scope. Add `-g` for user-global installation. The CLI detects Codex and installs under its `.agents/skills/` convention; use `-a codex` to make Codex explicit.

### Browse without installing

```bash
npx skills@latest add Arthird/design-designer --list
```

### Install all skills

```bash
npx skills@latest add Arthird/design-designer --all
```

For a non-interactive install to Codex only:

```bash
npx skills@latest add Arthird/design-designer --skill '*' -a codex -y
```

`--all` targets all detected agents. When only Codex is wanted, prefer the explicit `--skill '*' -a codex -y` form.

### Install individual skills

```bash
npx skills@latest add Arthird/design-designer --skill design-designer -a codex
npx skills@latest add Arthird/design-designer --skill token-writer -a codex
npx skills@latest add Arthird/design-designer --skill web-accessibility -a codex
```

### Install selected groups

Install the working-skill group:

```bash
npx skills@latest add Arthird/design-designer \
  --skill design-designer \
  --skill design-coder \
  --skill design-auditor \
  --skill token-writer \
  -a codex
```

Install the knowledge-skill group:

```bash
npx skills@latest add Arthird/design-designer \
  --skill ux-design-intelligence \
  --skill design-tokens-standard \
  --skill web-accessibility \
  --skill web-ui-foundations \
  --skill bem-components \
  --skill apple-platform-guidance \
  --skill material-platform-guidance \
  -a codex
```

The CLI supports repeated `--skill` flags, `--skill '*'`, project/global scopes, agent targeting, `--copy` for copy-based installs, and `--full-depth` for searching outside standard skill containers. See the [official CLI reference](https://github.com/vercel-labs/skills/blob/main/docs/commands.md) for the complete option set.

## Updating and removing

Update all installed skills, or one by name:

```bash
npx skills@latest update
npx skills@latest update design-designer
```

Use `-g` to target global installations or `-p` to target project installations. List installed skills with `npx skills@latest list`; remove with `npx skills@latest remove <skill>`. GitHub-source installations are tracked in `skills-lock.json` and can be checked/updated. Local-directory test installs are useful for validation but the CLI does not track them for `skills update`; install from `Arthird/design-designer` for normal updateable use.

## Skills

### Working skills

| Skill | Task |
|---|---|
| `design-designer` | Orchestrates requirements, knowledge checkpoints, rules, component registry, exceptions, planning, delegation, audits, and project changelog. |
| `design-coder` | Builds static HTML/CSS visual prototypes from approved specifications without JavaScript or application behavior. |
| `design-auditor` | Performs substantive expert audits and classifies confirmed violations, potential issues, recommendations, and unverifiable claims. |
| `token-writer` | Creates or repairs `design-tokens.json` and runs deterministic validation/CSS generation through project tools. |

### Knowledge skills

| Skill | Domain and primary source |
|---|---|
| `ux-design-intelligence` | UX and visual direction anchored in optional UI UX Pro Max, with explicit general fallback rules. |
| `design-tokens-standard` | DTCG Design Tokens Format Module 2025.10 and deterministic transformation guidance. |
| `web-accessibility` | WCAG 2.2, with WAI-ARIA Authoring Practices for interaction patterns. |
| `web-ui-foundations` | WHATWG HTML Living Standard, supported by MDN CSS/HTML documentation. |
| `bem-components` | BEM methodology for naming and component-local CSS architecture. |
| `apple-platform-guidance` | Apple Human Interface Guidelines, selected only for a confirmed Apple target. |
| `material-platform-guidance` | Material Design 3, selected only for a confirmed Material target. |

Each knowledge skill documents its primary source, official URL, revision, and last-checked date, plus a practical freshness procedure in its own directory. There is intentionally no central source catalog.

## Architecture and dependencies

Working skills consult knowledge at explicit workflow checkpoints. The orchestrator discovers and delegates in this order:

```text
design-designer
  -> [knowledge] ux-design-intelligence + optional ui-ux-pro-max
  -> [knowledge] web-accessibility
  -> [knowledge] apple-platform-guidance or material-platform-guidance
  -> [knowledge] design-tokens-standard
  -> token-writer
  -> [knowledge] web-ui-foundations
  -> [knowledge] bem-components
  -> [knowledge] web-accessibility
  -> design-coder
  -> design-auditor
```

The full checkpoint/failure table is in [design-designer's `SKILL.md`](skills/working/design-designer/SKILL.md). Each working skill also contains its own dependencies, triggers, and fallback behavior so it can be installed and used independently. The dependency graph is acyclic.

`ui-ux-pro-max` is optional and external. The orchestrator must discover it by exact skill name, inspect its actual `SKILL.md` and relevant references, and use verified recommendations only. It must never copy, modify, redistribute, or imply use of the external skill. If unavailable, `ux-design-intelligence` supplies fallback criteria.

## Repository structure

```text
.
├── skills/
│   ├── working/                 # Installable task workflows
│   │   ├── design-designer/
│   │   ├── design-coder/
│   │   ├── design-auditor/
│   │   └── token-writer/
│   └── knowledge/               # Installable domain knowledge
│       ├── ux-design-intelligence/
│       ├── design-tokens-standard/
│       ├── web-accessibility/
│       ├── web-ui-foundations/
│       ├── bem-components/
│       ├── apple-platform-guidance/
│       └── material-platform-guidance/
├── shared/                      # Repository-level workflow and policies
│   ├── workflow/
│   ├── VERSIONING.md
│   └── SOURCE-FRESHNESS.md
├── templates/                   # Component and project starter assets
├── demo/design-system/          # Demonstrated design-system fixture
├── README.md
├── LICENSE
└── .gitignore
```

Installable units are only the directories containing `SKILL.md`. Fixtures, templates, shared docs, and generated demo output are supporting materials and are not presented as skills.

## Prerequisites

- Codex with Skills CLI discovery/activation support.
- Node.js 22.20 or newer for the Skills CLI.
- Network access to GitHub and npm during installation and updates.
- Node.js for project token validation/generation tools in generated project artifacts.
- An optional separately installed `ui-ux-pro-max` skill for database-backed design intelligence.

The design-system tools use Node.js built-ins. This repository introduces no third-party runtime package for token validation, CSS generation, token utilities, or contrast calculation.

## Usage

Invoke the workflow:

```text
Use $design-designer to inspect this project and guide it through design-system rules, tokens, component specifications, CSS-only prototypes, audits, exceptions, and project changelog.
```

Invoke focused working skills:

```text
Use $token-writer to update semantic tokens and regenerate the project CSS.
Use $design-coder to prototype the approved input states in semantic HTML and scoped BEM CSS.
Use $design-auditor to audit the current design system without changing the baseline.
```

Invoke domain knowledge directly when you need a decision framework rather than artifact changes:

```text
Use $web-accessibility to evaluate this proposed focus and error-state design.
Use $design-tokens-standard to review this token structure before we edit the source.
```

## Design-system demo and template

`demo/design-system/` demonstrates the output contract and can be inspected locally. Copy and merge the complete starter files from `templates/project-template/design-system/`, including its component example and scripts; do not overwrite an existing design system blindly.

The demo's operational scripts are:

```text
scripts/validate-tokens.js      # Format and supported-reference validation
scripts/generate-css.js         # Deterministic CSS custom-property generation
scripts/token-utils.js          # Shared token resolution/validation helpers
scripts/contrast.js             # Contrast calculation helper
scripts/style-template.css      # Project base-style template
```

They are project tools, not a test framework. No automated test runner, test fixture harness, or CI test matrix ships with the repository.

## Manual acceptance

Automated test infrastructure is intentionally absent. Before release changes, perform the manual functional checks in [shared/workflow/manual-verification.md](shared/workflow/manual-verification.md), including:

- Skills CLI discovery;
- all-skill, individual-skill, and selected-group installs;
- Codex targeting and project/global scope;
- updates and cleanup;
- orchestrator delegation and dependency fallbacks;
- direct invocation of each working and knowledge skill;
- token validation/CSS generation and an audit with representative issues.

## Versioning and compatibility

Repository releases use semantic versions. Git history is the package history; there is intentionally no root changelog. See [shared/VERSIONING.md](shared/VERSIONING.md) for compatibility policy, skill-level change handling, and the release checklist. Knowledge freshness responsibilities are in [shared/SOURCE-FRESHNESS.md](shared/SOURCE-FRESHNESS.md).

## Scope and limitations

This ecosystem creates design specifications, tokens, generated CSS, and static visual prototypes. It does not implement production JavaScript, application state, data loading, form submission, navigation, or platform-native functional components.

Static artifacts cannot prove runtime keyboard behavior, assistive-technology operation, dynamic announcements, native device interaction, or production readiness. Report those checks as manual or unverifiable.

## License

The repository is available under the [MIT License](LICENSE).
