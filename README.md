# Design Designer Skill Ecosystem

An installable Codex skill ecosystem for designing, documenting, validating, and visually prototyping a project-specific design system.

The repository separates **working skills**, which execute tasks, from **knowledge skills**, which provide authoritative domain rules and decision criteria. Skills from one release form a compatible set. The project template is distributed separately and should be obtained from the same release.

<!-- VERSION:START -->
**Current version:** v2.2.1
<!-- VERSION:END -->

## Setup

### Step 1 — install the skills

Use the [Skills CLI](https://github.com/vercel-labs/skills) to install the complete compatible skill set from the current version above:

```bash
npx skills@latest add Arthird/design-designer@v2.2.0 --skill '*' -a codex -y
```

The release tag determines which skills are installed. Use the complete set from one tag. Add `-g` for a user-global installation; otherwise the CLI installs project-local Codex skills under `.agents/skills/`.

An interactive alternative is to omit `--skill`, `-a`, and `-y` after selecting the current release source:

```bash
npx skills@latest add Arthird/design-designer@v2.2.0
```

Select the complete skill set rather than mixing releases.

Browse available skills without installing:

```bash
npx skills@latest add Arthird/design-designer@v2.2.0 --list
```

### Step 2 — obtain the project template

The template is not part of the Skills CLI installation. Use Giget to extract it from the same release as the installed skills:

```bash
npx giget@latest gh:Arthird/design-designer/templates#v2.2.0 designed-design
```

The destination remains `designed-design`, and the project starter is kept in `designed-design/project-template` so its role is explicit. Keep the template tag aligned with the skills release.

### Step 3 — start working

Open `designed-design/project-template` as the project root and invoke the workflow from that directory:

```bash
cd designed-design/project-template
```

Do not invoke the workflow from the parent `designed-design` wrapper or from the repository root. The generated `design-system/` directory belongs inside the selected project root; otherwise it is created outside the starter directory.

```text
Use $design-designer to inspect this project and guide it through requirements, design rules, tokens, component specifications, platform-aware HTML/CSS/SVG visual prototypes, exceptions, audits, and project changelog.
```

Working skills can also be invoked directly:

```text
Use $token-writer to update semantic tokens and regenerate the project CSS.
Use $ui-type-discovery to find an HTML/CSS library for a Windows 11-inspired interface.
Use $ui-type-discovery to investigate terminal UI libraries and prepare a rendering plan.
Use $design-coder to create static prototypes using the approved rendering plan.
Use $design-auditor to audit the current design system without changing the baseline.
```

Domain knowledge skills can be invoked for a decision framework without changing project artifacts:

```text
Use $web-accessibility to evaluate this proposed focus and error-state design.
Use $design-tokens-standard to review this token structure before we edit the source.
```

### Step 4 — updating

Obtaining a template into a new directory is **not** an update workflow. Do not extract a new template over an existing project or overwrite local work.

The standard update command refreshes skills from the source and ref recorded at installation. It does **not** switch to a different release tag:

```bash
npx skills@latest update -p -y
```

Use `-g` instead of `-p` for user-global installations. This command is suitable for receiving updates within the recorded source/ref; it is not the release-selection mechanism.

To move to a new release, explicitly install the complete set from that tag:

```bash
npx skills@latest add Arthird/design-designer@v2.2.0 --skill '*' -a codex -y
```

All skills in a release should come from the same tag. Reinstalling may overwrite installed skill copies, so preserve and review local skill modifications before replacing them. Do not update arbitrary individual skills independently.

To evaluate template changes, extract the desired release into a new directory and compare it with the existing project. Preserve project-specific rules, tokens, components, exceptions, and other local modifications, then merge only the reviewed changes deliberately.

## Skills

### Working skills

| Skill             | Responsibility                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `design-designer` | Orchestrates discovery, knowledge checkpoints, visual-language and rendering decisions, rules, component registry, exceptions, planning, delegation, audits, and project changelog. |
| `ui-type-discovery` | Researches platform-inspired UI libraries, verifies sources, licenses, versions, runtime constraints, and writes a project rendering registry and plan when needed. |
| `design-coder`    | Creates framework-independent static HTML/CSS/SVG visual prototypes from approved specifications and rendering decisions without application JavaScript. |
| `design-auditor`  | Audits tokens, specifications, rendering decisions, semantics, HTML/CSS/SVG prototypes, and unverifiable claims. |
| `token-writer`    | Creates or repairs `design-tokens.json` and runs deterministic validation/CSS generation using project tools.                              |

### Knowledge skills

| Skill                        | Domain and primary source                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `ux-design-intelligence`     | UX and visual direction anchored in optional UI UX Pro Max, with explicit fallback rules. |
| `design-tokens-standard`     | DTCG Design Tokens Format Module 2025.10 and deterministic transformation guidance.       |
| `web-accessibility`          | WCAG 2.2 and WAI-ARIA Authoring Practices.                                                |
| `web-ui-foundations`         | WHATWG HTML Living Standard, supported by MDN HTML/CSS documentation.                     |
| `bem-components`             | BEM methodology for component naming and scoped CSS.                                      |
| `apple-platform-guidance`    | Apple Human Interface Guidelines for confirmed Apple targets.                             |
| `material-platform-guidance` | Material Design 3 for confirmed Material targets.                                         |

Each knowledge skill records its primary source, official URL, revision, last-checked date, and review trigger locally. There is no central source catalog.

## Dependencies and checkpoints

Working skills consult knowledge at explicit checkpoints. The orchestrator sequence is:

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
  -> [working, conditional] ui-type-discovery
  -> [optional] approved rendering-plan.md
  -> design-coder
  -> design-auditor
```

`ui-type-discovery` is conditional. It runs when the user selects or confirms a specialized platform-like visual language, requests a UI-kit search or revision, or no current approved rendering plan covers the task. Ordinary framework-independent web UI can proceed directly with semantic HTML/CSS. When no suitable external kit exists, custom HTML/CSS and inline SVG remain a valid rendering strategy.

The complete dependency, mandatory/optional, and fallback table is in [design-designer's `SKILL.md`](skills/working/design-designer/SKILL.md). Each working skill also declares its own checkpoints so it remains usable when invoked directly. The dependency graph is acyclic.

`ui-ux-pro-max` is optional and external. Install it separately when desired:

```bash
npx skills@latest add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max -a codex
```

The orchestrator inspects its actual instructions before use, applies verified recommendations only, and continues with `ux-design-intelligence` fallback rules when it is unavailable. The external skill is never copied or modified.

## Repository structure

```text
.
├── skills/
│   ├── working/                 # Installable task workflows
│   │   ├── design-designer/
│   │   ├── ui-type-discovery/
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
├── shared/                      # Repository workflow and policies
│   ├── workflow/
│   ├── VERSIONING.md
│   └── SOURCE-FRESHNESS.md
├── templates/                   # Component and project starter assets
│   └── project-template/design-system/
│       └── rendering-templates/ # Optional rendered-project document starters
├── demo/design-system/          # Demonstrated design-system fixture
├── README.md
├── LICENSE
└── .gitignore
```

Only directories containing `SKILL.md` are installable skills. Shared documentation, templates, demos, and generated output are supporting materials.

## Design-system tools and demo

The project template provides:

```text
design-system/scripts/
├── validate-tokens.js
├── generate-css.js
├── token-utils.js
├── contrast.js
└── style-template.css
```

The demo additionally contains `demo/design-system/scripts/audit-design-system.js`. That script is demonstration-only: it gathers mechanical evidence from the demo's static files and is intentionally not distributed in the project template. Expert review remains the responsibility of `design-auditor`, and the audit must not depend on the demo helper.

From a project containing `design-system/`:

```bash
node design-system/scripts/validate-tokens.js
node design-system/scripts/generate-css.js
```

`style.css` is deterministic generated output and must not be hand-edited. Shared base styles belong in `scripts/style-template.css`. These are operational project tools, not automated testing infrastructure.

Projects that use a specialized visual language may add `design-system/rendering/library-registry.md`, `rendering-plan.md`, and `rendering-report.md`. Starter documents are under `templates/project-template/design-system/rendering-templates/`; create the target directory only when the project actually needs a rendering decision. Ordinary HTML/CSS projects do not require an empty rendering subsystem.

## Accessibility scope

WCAG 2.2 and WAI-ARIA Authoring Practices remain the mandatory accessibility foundation for web projects and the baseline for native-project review. Apple and Material platform guidance covers platform interface conventions, not accessibility certification.

For native projects, WCAG/APG checks can reveal useful general issues, but native accessibility also requires separate evaluation of platform accessibility APIs, native semantics, focus and reading order, announcements, target sizes, scaling, gestures, and assistive technologies such as VoiceOver and TalkBack. A web-based audit is not complete native accessibility coverage or certification.

## Manual acceptance and verification

The repository intentionally has no automated test framework. Use the canonical [manual functional verification guide](shared/workflow/manual-verification.md) before release changes.

Core manual checks include:

- Skills CLI discovery and complete-set installation;
- Codex targeting and project/global scope;
- recorded-source/ref updates and explicit moves to a new release;
- Giget extraction from the matching release tag;
- orchestrator dependency checkpoints and fallbacks, including conditional UI-type discovery;
- direct invocation of each working and knowledge skill;
- token validation, deterministic CSS generation, and an expert audit;
- separation of static checks from runtime web and native accessibility verification.

Before publication, also verify all skill manifests and local documentation links. After publication, run the discovery and rendering scenarios against the new release tag.

## Versioning

Repository releases use semantic versions and form the compatibility unit. Use the complete skill set from one release and obtain the project template from that same tag. `v2.1.1` was a patch release that corrected release installation guidance. `v2.1.0` introduced `ui-type-discovery` and the platform-aware HTML/CSS/SVG rendering workflow. The next release is calculated from Conventional Commits since the latest tag. Do not mix independently updated skills or combine skills and templates from different releases.

See [shared/VERSIONING.md](shared/VERSIONING.md) for semantic-release behavior, release-operations instructions, and the compatibility policy. See [shared/SOURCE-FRESHNESS.md](shared/SOURCE-FRESHNESS.md) for knowledge-source review. Git tags and release notes are the package history; the repository deliberately has no root changelog.

## Scope and limitations

This ecosystem produces specifications, tokens, generated CSS, and static visual prototypes. It does not implement production JavaScript, application state, data loading, form submission, navigation, or native functional components.

Static artifacts cannot prove keyboard behavior, screen-reader or VoiceOver/TalkBack behavior, dynamic announcements, native device interaction, or production readiness. Report those as manual or unverifiable.

## License

The repository is available under the [MIT License](LICENSE).

## Release automation

[`.github/workflows/release.yml`](.github/workflows/release.yml) creates semantic versions from Conventional Commits and publishes GitHub Releases. The release configuration is [`.releaserc.json`](.releaserc.json); update and verification commands are in [shared/VERSIONING.md](shared/VERSIONING.md).
