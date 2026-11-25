# Design Designer Skill Ecosystem

`design-designer` is a modular Codex skill ecosystem for project-specific design-system discovery, documentation, tokens, CSS-only visual prototypes, and audits.

The ecosystem contains four independently callable sibling skills:

| Skill | Responsibility |
|---|---|
| `design-designer` | Orchestrates requirements, rules, registry, exceptions, progress, changelog, and specialist routing. |
| `token-writer` | Creates and validates `design-system/design-tokens.json` using Design Tokens Format Module 2025.10. |
| `design-coder` | Builds semantic HTML/CSS visual component prototypes without JavaScript. |
| `design-auditor` | Runs automated structural checks and guides expert reviews of the resulting system. |

All skill instructions are in English. At runtime, each skill responds in the user's language.

## Installation

Install all four sibling directories into the Codex skills directory. Set `CODEX_HOME` first when your environment uses a non-default location.

```bash
skill_root="${CODEX_HOME:-$HOME/.codex}/skills"
mkdir -p "$skill_root"
cp -R design-designer design-coder design-auditor token-writer "$skill_root"/
```

The main skill refers to its siblings as `$token-writer`, `$design-coder`, and `$design-auditor`. Install them together for the full workflow; each subskill also works on its own.

Optional design intelligence can be installed separately from [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill). At project time, the orchestrator checks availability before use, never invents or overwrites its content, and continues with project evidence when absent. It was not detected in the environment used to create this package.

## Usage

Invoke the full workflow:

```text
Use $design-designer to create or extend this project's design system.
```

Invoke a focused capability:

```text
Use $token-writer to define semantic tokens for this app and generate the CSS.
Use $design-coder to build the approved input states as a CSS-only visual prototype.
Use $design-auditor to audit design-system/ and report actionable findings.
```

Useful initial prompt:

```text
Use $design-designer to inspect this project, ask only for missing design context, and lead us through rules, tokens, components, prototypes, and audits. This is a visual prototype workflow, not production application implementation.
```

Skills inspect the repository before asking questions and respond in the user's language. The orchestrator preserves recorded user decisions and asks before proceeding with known accessibility or platform conflicts.

## Example and template

The ready-to-copy project template is in [`design-designer/assets/project-template/design-system`](design-designer/assets/project-template/design-system). It contains:

- approved example rules, tokens, registry, exceptions, plan, and changelog;
- a reusable [component specification template](design-designer/assets/component-spec-template.md);
- example button documentation, scoped BEM CSS, and static HTML states;
- deterministic token validator, CSS generator, base-style template, and contrast helper;
- an already generated example `style.css`.

The generator currently serializes the core scalar and composite types supported by the validator. It deliberately rejects object-valued `strokeStyle` and `gradient` values when the format does not provide enough information for a lossless CSS mapping. Use the generated CSS for token-derived styles and keep any documented platform-specific transformation in project code.

The validator is a compact project tool for the supported 2025.10 subset, not a complete implementation of every edge case in the specification. If a token uses a newer or vendor-specific feature, validate it with the project's full token pipeline and document the support boundary.

`$extends` is supported for inherited groups, including generation of inherited tokens and aliases to those inherited tokens. The example keeps the model simple; use extended groups only after checking the project's complete token pipeline.

When adding the template to a project that already has `design-system/`, merge deliberately and preserve existing work:

```bash
cp -R design-designer/assets/project-template/design-system /path/to/project/design-system-new
# Review and merge the needed files into /path/to/project/design-system.
```

The same example is materialized at [`design-system`](design-system) for direct inspection or local verification.

## Token commands

From a project containing `design-system/`:

```bash
node design-system/scripts/validate-tokens.js
node design-system/scripts/generate-css.js
node design-system/scripts/test-token-tools.js
node "${CODEX_HOME:-$HOME/.codex}/skills/design-auditor/scripts/audit-design-system.js" design-system
```

The generator writes `design-system/style.css` from `design-tokens.json` and the generator's `style-template.css`. Do not edit `style.css` directly. The validator checks the supported 2025.10 format subset and references, not visual quality, contrast, platform suitability, or complete accessibility.

## Verification

Run the ecosystem harness from this package:

```bash
node tests/test-ecosystem.js
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" design-designer
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" design-coder
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" design-auditor
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" token-writer
```

Behavioral test scenarios and edge cases are documented in [`design-designer/references/test-scenarios.md`](design-designer/references/test-scenarios.md).

## Boundaries

This ecosystem documents design systems and creates visual prototypes. It does not implement production application behavior, JavaScript, state management, data processing, real interactions, or platform-native functional components. Static prototypes must not be described as fully functional or production-ready.
