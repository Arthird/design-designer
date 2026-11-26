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
5. **Review:** `design-auditor` provides expert findings after tokens, specs, and prototypes; unresolved confirmed violations prevent `Reviewed`.

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

## Project changelog

Maintain `design-system/changelog.md` in reverse chronological order with date, affected areas, summary, and reason. Record meaningful changes to rules, tokens, component states, exceptions, architecture, and validation. Do not add a root repository changelog; package history belongs to Git and release metadata.
