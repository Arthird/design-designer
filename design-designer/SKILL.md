---
name: design-designer
description: Coordinate project-specific design-system creation, extension, documentation, tokens, component specifications, CSS-only prototypes, audits, exceptions, progress, and changelog. Use for end-to-end design-system work across web, mobile, desktop, or mixed platforms; not for production application implementation.
metadata:
  short-description: Orchestrate project design systems
---

# Design Designer

Create or extend one coherent design system for the current project. This skill owns discovery, decisions, documentation, coordination, and completion tracking. Delegate implementation-specific work to the sibling skills rather than repeating their detailed rules.

Respond in the language the user uses. Keep skill documentation and generated project artifacts in English unless the project already establishes another documentation language.

## Operating boundaries

- Inspect the repository, project documentation, and configuration before asking questions. Never ask for information already present.
- Ask only genuinely missing questions, progressively at the phase where they matter.
- Determine platforms, target technology, audience, constraints, and existing conventions for this project. Do not assume web or reuse tokens across unrelated platforms.
- Explain material UX, accessibility, and platform tradeoffs. If a requested decision conflicts with known requirements, state the conflict and ask whether the user intends to proceed. Never silently override their choice.
- User approval does not make an accessibility violation compliant. Record each known deviation and risk in `design-system/exceptions.md`.
- Prefer and document the existing design system when one exists. Reuse its components and tokens; do not create a parallel system without an explicit reason.
- Keep exceptions local to affected components. A component exception never changes a global rule by implication.
- This ecosystem produces specifications, design tokens, generated CSS, and static visual prototypes. It does not implement production behavior, JavaScript, application state, data handling, form submission, or real interactions.
- A visual prototype, a functional implementation, and a production-ready component are different deliverables. Never label a static prototype as functional or production-ready.

Read [references/workflow-details.md](references/workflow-details.md) when establishing status, gates, acceptance criteria, or artifact content. Read [references/sources.md](references/sources.md) before making a format-specific or accessibility claim that needs a primary source. For skill development or forward-testing, read [references/test-scenarios.md](references/test-scenarios.md).

## Subskill routing

| Work | Route |
|---|---|
| Create or change `design-tokens.json`; assess token types, aliases, and platform fit | Invoke `$token-writer` when available; otherwise follow `../token-writer/SKILL.md` and recommend explicit invocation |
| Specify, build, or revise HTML/CSS visual component prototypes | Invoke `$design-coder` when available; otherwise follow `../design-coder/SKILL.md` |
| Audit rules, tokens, specs, registry, accessibility, semantics, or prototypes | Invoke `$design-auditor` when available; otherwise follow `../design-auditor/SKILL.md` |

When a sibling is unavailable, continue with equivalent in-scope checks and tell the user which optional capability was unavailable. Do not claim a subskill ran when it did not.

## Workflow

Preserve this order, but allow the user to revisit earlier decisions. Do not create final artifacts until the relevant inputs and direction are established.

### Phase 0: Inspect the project

Inspect structure, documentation, component libraries, stylesheets, token files, build configuration, framework constraints, and repository instructions. Determine whether to extend an existing system and identify facts that can answer later questions.

### Phase 1: Establish requirements

Establish only the missing items among target platforms, technologies, product purpose, audience, project constraints, existing conventions, and desired visual direction. Record assumptions separately from confirmed decisions.

### Phase 2: Analyze references and design intelligence

Ask for references only if none were supplied and they are needed. Extract reusable principles rather than copying a reference wholesale. Review visual language, layout, type, color, spacing, components, interaction conventions, responsive behavior, and accessibility concerns.

Before creating a new design system, check whether `ui-ux-pro-max-skill` is installed and discoverable. If present, read its instructions and relevant resources and use its design knowledge as adaptable input. Do not modify or overwrite it. If absent, do not imply it was used; continue with available knowledge and mention the absent optional integration only when it affects the current decision.

Summarize the proposed direction and ask for confirmation or corrections before writing approved rules.

### Phase 3: Document design rules

Create `design-system/base-rules.md` with project-specific, component-actionable decisions: principles, visual language, typography, color, spacing/layout, borders/radii, shadows/elevation, iconography, responsive behavior, platform conventions, accessibility requirements, and component principles. Obtain review before generating tokens.

### Phase 4: Coordinate tokens and generated CSS

Invoke `$token-writer` to create or revise `design-system/design-tokens.json`. Require Design Tokens Format Module 2025.10 semantics and the project's actual platform constraints.

After token changes, run the deterministic generator and validator:

```bash
node design-system/scripts/generate-css.js
node design-system/scripts/validate-tokens.js
```

If the scripts do not exist, add them from the supplied project template before generating a stylesheet. `design-system/style.css` is generated output. Never hand-edit it. Any shared base styles belong in `design-system/scripts/style-template.css`, which the generator consumes.

### Phase 5: Build the component registry

Inspect implemented and documented components first, then ask which additional components belong in scope. Create `design-system/components.md` as a compact registry with purpose, design status, prototype status, variants/states summary, and exception links.

Use exactly these design statuses: `Not started`, `In progress`, `Approved`.

Use exactly these prototype statuses: `Not started`, `In progress`, `Completed`, `Reviewed`.

After a component is prototyped and audited, set both statuses to `Approved` and `Reviewed` only when the evidence supports them. `Completed` means the requested visual examples are finished, not that they are production-ready.

Keep detailed specifications and state descriptions in component folders.

### Phase 6: Specify components

Create `design-system/components/<component-name>/` with `component.md`, `component.css`, and only the HTML examples needed for its states. Use [assets/component-spec-template.md](assets/component-spec-template.md) as the reusable specification, and adapt every section to the component.

Each specification must cover purpose, design, variants, state coverage, interactions and expected behavior, responsive behavior, accessibility, dependencies, exceptions, and its HTML/CSS references. Classify every required state as CSS-reproducible, static visual, or functional behavior.

### Phase 7: Record exceptions

Ask whether any component intentionally needs a local deviation. Create or update `design-system/exceptions.md` with component, overridden rule, reason, approval status, accessibility impact, and scope. State explicitly when there are none.

### Phase 8: Plan implementation

Create `design-system/implementation-plan.md`. Order component work by dependencies, reuse, complexity, importance, and platform needs. Let the user review or adjust the order before broad prototyping.

### Phase 9: Coordinate visual prototyping

For each approved specification, invoke `$design-coder`. Require it to use generated global tokens, scoped BEM component CSS, semantic HTML, CSS-only state reproduction where possible, and static examples only for visual states CSS cannot produce. No JavaScript or misleading simulated behavior.

Update the registry after each component. A component may be `Reviewed` only after audit and resolution or explicit recording of significant issues.

### Phase 10: Audit at gates

Invoke `$design-auditor` after token creation, after initial specifications, after prototyping, and before final review. Separate automated results from expert review. Do not claim automated checks guarantee complete accessibility.

Track unresolved findings with severity, location, explanation, and recommended correction. Explain knowingly accepted risks rather than relabeling them as passed.

### Phase 11: Maintain the changelog

Create `design-system/changelog.md`. Add meaningful dated entries for changes to rules, tokens, components, states, exceptions, generated CSS architecture, and validation. Include the reason and affected files or areas. Omit trivial edits.

## Completion check

Before declaring the system reviewed, verify required files, token validation, deterministic CSS generation, BEM scope, no JavaScript in prototype directories, state coverage, audit status, exception records, responsive and accessibility review, and an up-to-date registry and changelog. Report remaining warnings and manual checks honestly.
