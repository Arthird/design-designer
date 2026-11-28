# Design-System Workflow Contract

Use this shared reference for the design-system artifact contract, status values, and review gates. Project requirements override this default structure when a different organization is justified and documented.

## Structure

```text
design-system/
├── base-rules.md
├── design-tokens.json
├── style.css                    # generated; never hand-edited
├── components.md
├── exceptions.md
├── implementation-plan.md
├── changelog.md
├── components/<component-name>/
│   ├── component.md
│   ├── component.css
│   └── <component-name>[-state].html
└── scripts/
    ├── validate-tokens.js
    ├── generate-css.js
    ├── token-utils.js
    ├── contrast.js
    └── style-template.css
```

Projects that use a specialized visual language or an external static renderer may add a rendering subsystem only when it carries real decisions:

```text
design-system/
└── rendering/
    ├── library-registry.md       # verified project candidates and decisions
    ├── rendering-plan.md         # approved renderer and dependency policy
    └── rendering-report.md       # implementation evidence by component
```

Do not create empty rendering files for ordinary projects that use semantic HTML/CSS directly. `ui-type-discovery` owns the registry and plan; `design-coder` owns the report after implementation.

Do not add a parallel token source, manually maintained global stylesheet, or duplicate component documentation without a concrete reason. Shared knowledge and templates live outside the skill directories so installed skills remain focused.

## Decision ledger

Record these decisions in `base-rules.md` or the most relevant artifact:

- confirmed platforms, minimum versions, and technology constraints;
- product purpose, audience, and project constraints;
- approved visual direction and reference analysis;
- accessibility target and known limits;
- whether an existing system is being extended, migrated, or replaced.

Mark each material decision `Confirmed`, `Assumed`, or `Open`. Do not silently turn an assumption into an approved rule.

## Review gates

1. **Direction:** project facts and design-intelligence findings are summarized; the user confirms or corrects them.
2. **Rules:** `base-rules.md` is specific enough to guide component decisions; the user reviews or approves it.
3. **Tokens:** `token-writer` has consulted `design-tokens-standard`, the token source validates, target-platform implications are reviewed, and generated CSS is reproducible.
4. **Component specification:** variants and states are classified before visual prototyping.
5. **Rendering decision:** a specialized visual language has a current approved plan with verified sources, versions, licenses, runtime policy, component coverage, and limitations; otherwise the project records an approved custom HTML/CSS/inline SVG fallback. The plan precedes `design-coder`, and the rendering report follows implementation.
6. **Review:** `design-auditor` provides expert findings after tokens, specs, the rendering decision where applicable, and prototypes; unresolved confirmed violations prevent `Reviewed`.

Accepted risk is recorded with scope and impact. User approval does not convert an accessibility failure into compliance.

## Registry values

| Field | Allowed values |
|---|---|
| Design status | `Not started`, `In progress`, `Approved` |
| Prototype status | `Not started`, `In progress`, `Completed`, `Reviewed` |

`Completed` means the requested visual examples are complete. `Reviewed` means an expert audit found no unresolved significant issue or the remaining risks are explicitly documented and accepted. A static prototype remains distinct from a production component.

## State contract

Each component's state table records:

| State | Classification | CSS handling | Static example | Unimplemented behavior |
|---|---|---|---|---|

Classifications are exactly `CSS-reproducible`, `Static visual`, or `Functional behavior`. CSS-native states do not need separate HTML files. Application-controlled visual states may need one static example. Functional behavior is documented and left unimplemented by visual-prototype work.

## Existing systems

Before replacing or creating a parallel system:

1. Identify existing tokens, components, naming, accessibility behavior, and platform patterns.
2. Decide whether to extend, refactor, or replace.
3. Explain migration and compatibility impact and obtain explicit user direction.
4. Track deferred migration rather than changing unrelated callers silently.

## Visual rendering

Keep the actual target platform separate from the visual language. A web prototype styled like Windows, macOS, iOS, Material, a terminal, or a game console is still a web prototype and does not prove native APIs or platform behavior.

Use `ui-type-discovery` when a specialized visual language requires a renderer decision, a search is explicitly requested, or no current approved plan covers the components. Reuse an approved plan whose language, target, exact versions, dependencies, component coverage, and evidence still apply. Do not create a rendering subsystem for ordinary semantic HTML/CSS work.

For each component, prefer an approved suitable HTML/CSS library component, then justified inline SVG for a static visual gap, then custom semantic HTML/CSS. Keep text as HTML, keep controls as native elements, and embed useful SVG in the HTML document. Do not substitute a drawn interface for a real interactive control or use a runtime-dependent library without an explicit policy decision.

## Project changelog

Maintain `design-system/changelog.md` in reverse chronological order with date, affected areas, summary, and reason. Record meaningful changes to rules, tokens, component states, exceptions, architecture, and validation. Do not add a root repository changelog; package history belongs to Git and release metadata.
