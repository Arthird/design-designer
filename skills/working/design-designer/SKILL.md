---
name: design-designer
description: Orchestrate project-specific design-system creation, extension, documentation, tokens, component specifications, CSS-only visual prototypes, audits, exceptions, progress, and changelog. Use for end-to-end design-system work across web, mobile, desktop, or mixed platforms; not for production application implementation.
metadata:
  short-description: Orchestrate project design systems
---

# Design Designer

Create or extend one coherent design system for the current project. Own discovery, decisions, documentation, coordination, and review gates. Delegate implementation work to working skills and consult knowledge skills at explicit checkpoints instead of reproducing their domain rules.

Respond in the language the user uses. Keep skill instructions, artifact headings, and code comments in English unless the project has an established documentation language.

Read [references/design-system-workflow.md](references/design-system-workflow.md) for artifact contracts, status values, review gates, and edge cases. This file travels with the installed skill.

## Dependencies and checkpoints

Discover skills by their exact names before relying on them. Start by inspecting the choices below, then use the applicable files or invocation method. Do not invoke a working skill merely to read its knowledge.

Use this discovery order:

1. Inspect the active skill catalog and local project skills for exact names.
2. For Skills CLI installations, run `npx skills@latest list --json` and inspect the returned skill names/sources.
3. In a Codex project, inspect `.agents/skills/<skill-name>/SKILL.md`; for a user-global install, inspect `~/.agents/skills/<skill-name>/SKILL.md`.
4. Inspect the external `ui-ux-pro-max` entrypoint only when its skill directory exists, normally `.agents/skills/ui-ux-pro-max/SKILL.md` project-locally.
5. If a required dependency is absent, apply its fallback in the table and state the missing capability.

| Dependency | Type | Checkpoint and trigger | Mandatory? | If unavailable |
|---|---|---|---|---|
| `ux-design-intelligence` | knowledge | Phase 2, before proposing or revising visual direction, palette, typesetting, density, layout, component character, or UX quality. | Mandatory for a new or materially changed visual direction. | Continue with project evidence and the local fallback rules; state that database-backed design intelligence was unavailable. |
| `design-tokens-standard` | knowledge | Phase 4, before token type, reference, alias, group, or platform-transform decisions. | Mandatory for token changes. | Stop token authoring and report the missing format authority; do not invent token semantics. |
| `web-accessibility` | knowledge | Phase 3 before web accessibility acceptance rules; Phase 6 before interactive component specs; Phase 9 when a prototype presents a state; Phase 10 in audit. | Mandatory whenever the project includes web UI. | Preserve recorded requirements, mark accessibility review incomplete, and do not claim compliance. |
| `web-ui-foundations` | knowledge | Phase 6 before selecting HTML/CSS mechanisms; Phase 9 before a static web prototype; Phase 10 for semantics/CSS review. | Mandatory for web HTML/CSS deliverables. | Continue only if the project documents equivalent conventions; otherwise report implementation review as incomplete. |
| `bem-components` | knowledge | Phase 6 before naming component architecture; Phase 9 before CSS; Phase 10 during component/CSS audit. | Mandatory when BEM is the documented naming convention. | Use a documented project convention if available; otherwise ask and record the alternative. |
| `apple-platform-guidance` | knowledge | Phase 1 after confirming an Apple platform; Phase 3 for platform rules; Phase 6 and Phase 10 for Apple interaction requirements. | Mandatory for confirmed Apple targets. | Do not substitute web conventions. Continue other work and flag Apple platform review as unresolved. |
| `material-platform-guidance` | knowledge | Phase 1 after confirming a Material target; Phase 3 for platform rules; Phase 6 and Phase 10 for Material interaction requirements. | Mandatory for confirmed Material targets. | Do not substitute web conventions. Continue other work and flag Material platform review as unresolved. |
| `token-writer` | working | Phase 4, after approved rules and token requirements are known; again for later public token changes. | Mandatory for authoring/repairing `design-tokens.json` and regenerating CSS. | Recommend installation; use an existing project token pipeline only after inspecting and documenting it. |
| `design-coder` | working | Phase 9, only after the target component specification is approved enough to determine variants and states. | Mandatory for visual HTML/CSS prototyping. | Recommend installation and avoid editing prototype files without a documented equivalent workflow. |
| `design-auditor` | working | Phase 10 after tokens, after initial specs, after prototyping, and before final review. | Mandatory for claiming `Reviewed`. | Perform only explicitly in-scope checks, report the missing specialist audit, and leave review status unreviewed. |
| `ui-ux-pro-max` (external) | optional design intelligence | Phase 2 discovery and again only when a new visual direction is needed. It never replaces local knowledge or standards. | Optional. Install separately with `npx skills@latest add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max -a codex`. | Use the fallback path in `ux-design-intelligence`; never imply it ran. |

The dependency graph is acyclic: knowledge skills never invoke working skills; the orchestrator invokes working skills after the applicable knowledge checkpoint; working skills may consult knowledge skills but do not orchestrate one another. Do not copy, install, modify, or redistribute `ui-ux-pro-max` from this skill.

## Workflow

Preserve the phase order while allowing earlier decisions to be revisited. Do not create final artifacts before the relevant decisions are established.

### Phase 0: inspect the project

Inspect repository structure, documentation, configuration, existing tokens, components, styles, platform indicators, and design-system artifacts. Record facts that answer later questions. Never ask for information already available in the files or conversation.

### Phase 1: establish requirements

Determine the missing elements of platforms, technology, product purpose, audience, constraints, existing conventions, and visual direction. Confirm actual target platforms. If an Apple target is confirmed, discover `apple-platform-guidance`; if a Material target is confirmed, discover `material-platform-guidance`. Record assumptions separately from confirmed decisions.

### Phase 2: establish design intelligence

For a new or materially changed visual direction, check for `ux-design-intelligence` and the optional external `ui-ux-pro-max` skill. Read the local knowledge first. If UI UX Pro Max is available, inspect its own `SKILL.md` and only the relevant references, then apply useful product-specific recommendations. Do not use its persistence or modification features merely to create this project's required artifact structure. Never include private project data in search queries.

Capture the visual-language proposal: principles, typography, color roles, spacing/density, layout, component character, interaction conventions, responsive behavior, and anti-patterns. Ask the user to confirm or correct it before writing approved rules. If the external skill is absent, use the documented fallback and state once that database-backed design intelligence was unavailable.

### Phase 3: document design rules

Create or update `design-system/base-rules.md`. Consult `web-accessibility` for web criteria and only the platform-specific knowledge skill that matches the confirmed native target. Document principles, visual language, typography, color, spacing/layout, borders/radii, shadows/elevation, iconography, responsive behavior, platform conventions, accessibility, and component principles. Make rules concrete enough to guide component decisions; obtain review before token changes.

### Phase 4: coordinate token authoring

Read `design-tokens-standard`, then invoke `$token-writer` to create or revise `design-system/design-tokens.json` under the approved rules and constraints. After token changes, run deterministic validation and CSS generation:

```bash
node design-system/scripts/validate-tokens.js
node design-system/scripts/generate-css.js
```

`design-system/style.css` is generated output and must not be hand-edited. If tools are missing, copy the reusable project starter from this ecosystem's `templates/project-template/design-system/scripts/`; never substitute hand-authored CSS for a deterministic generator.

### Phase 5: build the component registry

Inspect existing components first, then ask which additional components are in scope. Create or update `design-system/components.md` with purpose, design status, prototype status, variant/state summary, and exceptions. Use exactly `Not started`, `In progress`, `Approved` and `Not started`, `In progress`, `Completed`, `Reviewed`. Keep detailed specs in component folders.

### Phase 6: approve component specifications

Read `web-ui-foundations` for markup/CSS mechanisms, `bem-components` for class architecture when BEM applies, `web-accessibility` for web interaction and accessibility requirements, and the matching Apple or Material knowledge skill for validated native targets. Create `component.md`, `component.css`, and necessary HTML examples. Use the component specification template supplied with the ecosystem.

Every specification must define purpose, design, variants, state coverage, expected behavior, responsive behavior, accessibility, dependencies, exceptions, and file references. Classify each state as CSS-reproducible, static visual, or functional behavior. Obtain approval or explicit adjustment before Phase 9.

### Phase 7: record exceptions

Ask whether a component intentionally deviates. Create or update `design-system/exceptions.md` with component, overridden rule, reason, approval status, accessibility impact, and scope. State `None.` when none exist. User approval documents a risk; it does not make an accessibility violation compliant.

### Phase 8: plan implementation

Create or update `design-system/implementation-plan.md`, ordering work by dependencies, reuse, complexity, importance, and platform requirements. Let the user adjust the order before broad prototyping.

### Phase 9: coordinate visual prototyping

Invoke `$design-coder` for each approved specification. Require it to consult its declared knowledge dependencies, use generated global custom properties, produce scoped BEM CSS where BEM applies, and use semantic static HTML. No JavaScript, application logic, data loading, simulated submission, or fake navigation. Update the registry only after examples and documentation agree.

### Phase 10: audit at review gates

Invoke `$design-auditor` after token creation, initial component specifications, prototyping, and before final review. Require expert analysis in addition to operational token checks. Separate confirmed violations, potential issues, recommendations, and unverifiable behavior. Do not mark a component `Reviewed` while a significant unresolved issue remains.

### Phase 11: maintain project history

Create or update `design-system/changelog.md` for project-level changes to rules, tokens, components, states, exceptions, generated CSS architecture, and validation. Include date, affected files or areas, summary, and reason. Do not add a repository-root changelog; Git history is package history.

## Conflict and incompleteness rules

- Normative specifications outrank design recommendations and platform guidelines.
- Surface platform-versus-accessibility and project-versus-standard conflicts instead of silently choosing one.
- Record accepted deviations locally in `exceptions.md`.
- If required context, a tool, a platform, or an upstream artifact is missing, apply the dependency fallback. Never fabricate files, validation, approval, or specialist execution.

## Completion criteria

Before declaring a system reviewed, verify approved rules; standard-conformant tokens; deterministic fresh CSS; aligned component specs and examples; approved BEM and semantic conventions; no JavaScript in visual prototypes; recorded exceptions and risks; an audit separating confirmed issues from unknowns; accurate registry state; and meaningful project changelog history.
