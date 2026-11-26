# Design Designer Skill Ecosystem

An installable Codex skill ecosystem for designing, documenting, validating, and visually prototyping a project-specific design system.

The repository separates **working skills**, which execute tasks, from **knowledge skills**, which provide authoritative domain rules and decision criteria. Skills from one release form a compatible set. The project template is distributed separately and should be obtained from the same release.

## Setup

### Step 1 — install the skills

Use the [Skills CLI](https://github.com/vercel-labs/skills) to install the working skills from the repository:

```bash
npx skills@latest add Arthird/design-designer
```

The CLI is interactive by default and lets you choose the skills and target agents. For a non-interactive Codex install of the complete compatible `v2.0.0` set:

```bash
npx skills@latest add Arthird/design-designer@v2.0.0 --skill '*' -a codex -y
```

Browse available skills without installing:

```bash
npx skills@latest add Arthird/design-designer --list
```

Use `-g` for a user-global installation. Omit it for project-level installation. Codex project skills are installed under `.agents/skills/`.

### Step 2 — obtain the project template

The template is not part of the Skills CLI installation. Use Giget to extract it from the same release as the installed skills:

```bash
npx giget@latest gh:Arthird/design-designer/templates/project-template#v2.0.0 designed-design
```

The destination remains `designed-design`. Keep the template tag aligned with the skills release. For example, `v2.0.0` skills should be paired with the `v2.0.0` template.

### Step 3 — start working

Open `designed-design` as the project you want to design and invoke the workflow:

```text
Use $design-designer to inspect this project and guide it through requirements, design rules, tokens, component specifications, CSS-only visual prototypes, exceptions, audits, and project changelog.
```

Working skills can also be invoked directly:

```text
Use $token-writer to update semantic tokens and regenerate the project CSS.
Use $design-coder to prototype the approved input states in semantic HTML and scoped BEM CSS.
Use $design-auditor to audit the current design system without changing the baseline.
```

Domain knowledge skills can be invoked for a decision framework without changing project artifacts:

```text
Use $web-accessibility to evaluate this proposed focus and error-state design.
Use $design-tokens-standard to review this token structure before we edit the source.
```

### Step 4 — updating

Obtaining a template into a new directory is **not** an update workflow. Do not extract a new template over an existing project or overwrite local work.

Update the installed skills as a complete release set:

```bash
npx skills@latest update -p -y
```

Use `-g` instead of `-p` for user-global installations. The repository policy is to keep all skills from one compatible release rather than mixing independently updated versions.

To evaluate template changes, extract the desired release into a new directory and compare it with the existing project. Preserve project-specific rules, tokens, components, exceptions, and other local modifications, then merge only the reviewed changes deliberately.

## Skills

### Working skills

| Skill | Responsibility |
|---|---|
| `design-designer` | Orchestrates discovery, knowledge checkpoints, rules, component registry, exceptions, planning, delegation, audits, and project changelog. |
| `design-coder` | Creates static HTML/CSS visual prototypes from approved specifications without JavaScript or application behavior. |
| `design-auditor` | Performs expert design-system audits and distinguishes confirmed violations, potential issues, recommendations, and unverifiable claims. |
| `token-writer` | Creates or repairs `design-tokens.json` and runs deterministic validation/CSS generation using project tools. |

### Knowledge skills

| Skill | Domain and primary source |
|---|---|
| `ux-design-intelligence` | UX and visual direction anchored in optional UI UX Pro Max, with explicit fallback rules. |
| `design-tokens-standard` | DTCG Design Tokens Format Module 2025.10 and deterministic transformation guidance. |
| `web-accessibility` | WCAG 2.2 and WAI-ARIA Authoring Practices. |
| `web-ui-foundations` | WHATWG HTML Living Standard, supported by MDN HTML/CSS documentation. |
| `bem-components` | BEM methodology for component naming and scoped CSS. |
| `apple-platform-guidance` | Apple Human Interface Guidelines for confirmed Apple targets. |
| `material-platform-guidance` | Material Design 3 for confirmed Material targets. |

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
  -> design-coder
  -> design-auditor
```

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

## Accessibility scope

WCAG 2.2 and WAI-ARIA Authoring Practices remain the mandatory accessibility foundation for web projects and the baseline for native-project review. Apple and Material platform guidance covers platform interface conventions, not accessibility certification.

For native projects, WCAG/APG checks can reveal useful general issues, but native accessibility also requires separate evaluation of platform accessibility APIs, native semantics, focus and reading order, announcements, target sizes, scaling, gestures, and assistive technologies such as VoiceOver and TalkBack. A web-based audit is not complete native accessibility coverage or certification.

## Manual acceptance and verification

The repository intentionally has no automated test framework. Use the canonical [manual functional verification guide](shared/workflow/manual-verification.md) before release changes.

Core manual checks include:

- Skills CLI discovery and complete-set installation;
- Codex targeting and project/global scope;
- complete-set updates;
- Giget extraction from the matching release tag;
- orchestrator dependency checkpoints and fallbacks;
- direct invocation of each working and knowledge skill;
- token validation, deterministic CSS generation, and an expert audit;
- separation of static checks from runtime web and native accessibility verification.

Before publication, also verify all skill manifests and local documentation links.

## Versioning

Repository releases use semantic versions and form the compatibility unit. Use the complete skill set from one release and obtain the project template from that same tag. Do not mix independently updated skills or combine skills and templates from different releases.

See [shared/VERSIONING.md](shared/VERSIONING.md) for the concise release policy and [shared/SOURCE-FRESHNESS.md](shared/SOURCE-FRESHNESS.md) for knowledge-source review. Git tags and release notes are the package history; the repository deliberately has no root changelog.

## Scope and limitations

This ecosystem produces specifications, tokens, generated CSS, and static visual prototypes. It does not implement production JavaScript, application state, data loading, form submission, navigation, or native functional components.

Static artifacts cannot prove keyboard behavior, screen-reader or VoiceOver/TalkBack behavior, dynamic announcements, native device interaction, or production readiness. Report those as manual or unverifiable.

## License

The repository is available under the [MIT License](LICENSE).
