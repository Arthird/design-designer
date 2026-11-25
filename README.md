# Design Designer Skill Ecosystem

`design-designer` is a modular Codex skill ecosystem for defining, documenting, validating, and visually prototyping a consistent design system for an individual project.

The ecosystem separates design decisions and documentation from visual prototyping and auditing. It produces design-system artifacts, tokens, generated CSS, and static HTML/CSS prototypes; it does not implement production application behavior.

## Project status

Version 1.0.0 is ready for use as a skill ecosystem. The required artifact set, generators, validation tooling, checks, examples, tests, and documentation are present. The current example is web-focused; the workflow itself requires each project's platforms, rendering technology, and constraints to be established independently rather than assuming a web target.

See [CHANGELOG.md](CHANGELOG.md) for package history and [docs/verification.md](docs/verification.md) for checklist evidence and the latest validation results.

## Skills

| Skill | Independent responsibility | Deliberate boundary |
|---|---|---|
| `design-designer` | Works through project discovery, requirements, references, rules, tokens, component registry and specifications, exceptions, planning, prototyping, audits, and changelog. Routes specialist work. | Does not duplicate the implementation-level procedures owned by subskills. |
| `token-writer` | Creates, extends, migrates, and validates `design-tokens.json`; runs deterministic generation after token changes. | Does not hand-edit generated `style.css` or implement components. |
| `design-coder` | Creates static visual component prototypes from approved specs using semantic HTML, scoped BEM CSS, and generated token custom properties. | Does not write JavaScript, application logic, real interaction, or production functionality. |
| `design-auditor` | Runs automated checks and expert review across rules, tokens, specs, semantics, CSS, registry, exceptions, and static prototypes. | Does not implement fixes during a baseline audit or certify complete accessibility. |

All instructions and internal documentation are in English. Each skill responds to users in the language they use.

## Prerequisites

Required for the full toolkit:

- Codex with skill discovery and explicit invocation support.
- Node.js 18 or newer. The verified environment uses Node.js 24.
- Python 3 for the optional skill-creator structural validator.
- Git for repository and change-history use.

Runtime dependencies of the included example: Node.js built-ins only. The token generator and validator do not require third-party npm packages. An internet connection is needed only when consulting linked external documentation or installing optional skills/assets.

Optional:

- `skill-creator` system skill for `quick_validate.py`.
- [`ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) for complementary design intelligence. The orchestrator checks actual availability, uses it as adaptable input when present, and does not imply its use when absent. It does not modify that skill.
- A platform-specific design source, such as [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) or [Material Design 3](https://m3.material.io/), when relevant.

## Installation

Install all four sibling directories into the same Codex skills directory. They must remain siblings because the orchestrator routes to them. Each subskill is otherwise self-contained and can also be invoked directly.

```bash
skill_root="${CODEX_HOME:-$HOME/.codex}/skills"
mkdir -p "$skill_root"
cp -R design-designer design-coder design-auditor token-writer "$skill_root"/
```

If you install only a subskill, copy its directory and its referenced local files together. Do not copy only `SKILL.md`; each skill uses its own `references/` resources, and `design-auditor` also includes its audit script.

## Directory structure

```text
.
├── README.md                  # Package overview, setup, usage, and structure
├── CHANGELOG.md               # Package-level version history
├── LICENSE                    # MIT license for this package
├── .gitignore                 # Local dependencies, secrets, caches, and OS files
├── design-designer/           # Main orchestrator skill
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   ├── references/            # Workflow, primary sources, test scenarios
│   └── assets/                # Component template and copyable project template
├── design-coder/              # CSS-only visual prototyping skill
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   └── references/            # Prototype rules and sources
├── design-auditor/            # Audit skill and executable checker
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   ├── references/            # Audit method and sources
│   └── scripts/audit-design-system.js
├── token-writer/              # Token authoring skill
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   └── references/            # Token guidance and sources
├── design-system/             # Materialized example project
│   ├── base-rules.md
│   ├── design-tokens.json
│   ├── style.css              # Generated; no manual token edits
│   ├── components.md
│   ├── exceptions.md
│   ├── implementation-plan.md
│   ├── changelog.md
│   ├── components/button/     # Spec, scoped CSS, and static HTML states
│   └── scripts/               # Token validation and deterministic generation
├── docs/verification.md       # Checklist evidence and known limitations
└── tests/                     # Integration and document-validation harnesses
```

The copyable project template mirrors the structure inside `design-designer/assets/project-template/design-system/`.

## Purpose and scope

The ecosystem helps a project define one coherent design direction and maintain it as implementable documentation. It is suitable for:

- a new design system with no approved visual language;
- extending an existing token/component system without creating a duplicate;
- designing CSS-only visual references for an existing application;
- auditing whether rules, tokens, component specs, and prototypes remain aligned.

It is not suitable for implementing production interactions, application state, data loading, form submission, navigation, platform-native functional components, or full accessibility certification. Those remain separate implementation and runtime-testing activities.

## Usage

### Full orchestrated workflow

```text
Use $design-designer to inspect this project and lead it through requirements, design rules, tokens, components, visual prototypes, exceptions, audits, and changelog. Ask only for missing context and keep implementation out of the prototype scope.
```

The orchestrator follows the project workflow while applying these decision gates:

1. Discover project facts and existing conventions without unnecessary questions.
2. Confirm the design direction and references.
3. Get review of the proposed base rules before token generation.
4. Validate tokens and regenerate CSS after token changes.
5. Approve component specifications before visual prototyping.
6. Record exceptions and accessibility risks explicitly.
7. Audit after token creation, initial specs, prototyping, and before final review.

Its complete phase instructions live in [design-designer/SKILL.md](design-designer/SKILL.md), with artifact contracts and gates in [workflow-details.md](design-designer/references/workflow-details.md).

### Direct subskill invocations

```text
Use $token-writer to create or update the semantic design tokens for this project and regenerate the CSS.
Use $design-coder to prototype the approved input states in semantic HTML and scoped BEM CSS.
Use $design-auditor to audit design-system/ and report actionable findings without changing the baseline.
```

For a focused revision:

```text
Use $design-coder to add a focus-visible state to the existing button prototype. Read the approved component spec first and do not add JavaScript.
```

### Example project

The materialized [design-system](design-system) contains a reviewed button prototype. Open its HTML files through a local static server or directly from disk to inspect the visual examples. Edit `design-tokens.json` or the generator template, then regenerate CSS; do not edit `style.css` directly.

To use the template in another project:

```bash
cp -R design-designer/assets/project-template/design-system /path/to/project/design-system-new
# Review and merge the needed files into /path/to/project/design-system.
```

Preserve any existing design system and merge deliberately. Do not blind-copy over a project that already has project-specific rules or tokens.

## Token commands

From a project containing `design-system/`:

```bash
node design-system/scripts/validate-tokens.js
node design-system/scripts/generate-css.js
node design-system/scripts/test-token-tools.js
node "${CODEX_HOME:-$HOME/.codex}/skills/design-auditor/scripts/audit-design-system.js" design-system
```

Generation writes `style.css` from `design-tokens.json` plus `scripts/style-template.css`. The generated file is deterministic project output and must not be hand-edited. The validator covers the supported 2025.10 format subset and references; it does not establish contrast, platform suitability, or complete accessibility.

The included validator and generator intentionally reject cases they cannot represent safely, including object-valued `strokeStyle` and directionless `gradient` values. Document the platform mapping boundary rather than emitting misleading CSS.

## Documentation and knowledge sources

The orchestrator includes [primary source links](design-designer/references/sources.md), and each subskill has its own source list so it remains usable when installed alone:

- [design-coder sources](design-coder/references/sources.md)
- [design-auditor sources](design-auditor/references/sources.md)
- [token-writer sources](token-writer/references/sources.md)

The primary references include the [Design Tokens Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/), [MDN HTML/CSS](https://developer.mozilla.org/en-US/docs/Web), [WHATWG HTML](https://html.spec.whatwg.org/), [BEM methodology](https://en.bem.info/methodology/), and relevant platform guidance. The token specification is a Design Tokens Community Group specification, not a W3C Standard.

## Verification

Run the integration harness and verify the package structure:

```bash
node tests/test-ecosystem.js
node design-system/scripts/validate-tokens.js
node design-system/scripts/generate-css.js
node design-system/scripts/test-token-tools.js
python3 tests/validate_documents.py
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" design-designer
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" design-coder
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" design-auditor
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" token-writer
```

Behavioral test cases are in [test-scenarios.md](design-designer/references/test-scenarios.md). Verification evidence, executed commands, and known limitations are recorded in [docs/verification.md](docs/verification.md).

## Quality criteria

- Project-specific decisions precede generated artifacts.
- Existing design systems are extended and reused rather than duplicated.
- Accessibility conflicts are explained, recorded, and never relabeled as compliant by user approval alone.
- Tokens validate and generated CSS is reproducible.
- Component state coverage distinguishes CSS-reproducible, static visual, and functional behavior.
- Prototype CSS is BEM-scoped and consumes generated global custom properties where applicable.
- No JavaScript or simulated application behavior appears in visual prototypes.
- Automated tooling is reported separately from expert review and runtime accessibility testing.

## Known limitations

- The example and its automated HTML/CSS checks are web-oriented. Other platforms require project-specific conversion, validation, and prototype strategy.
- The included token validator/generator is a compact supported subset, not a complete implementation of every Design Tokens 2025.10 edge case.
- Static prototypes do not establish runtime keyboard operation, screen-reader behavior, dynamic announcements, or production readiness.
- The optional `ui-ux-pro-max-skill` was not installed during packaging; the ecosystem's fallback behavior is implemented and documented.

## License

This package is licensed under the [MIT License](LICENSE).
