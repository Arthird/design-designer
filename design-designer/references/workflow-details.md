# Design-System Workflow Details

Use this reference for artifact contracts, gates, and edge cases. The user's project requirements override this default structure when a justified alternative is better.

## Artifact contract

The default project output is:

```text
design-system/
├── base-rules.md
├── design-tokens.json
├── style.css
├── components.md
├── exceptions.md
├── implementation-plan.md
├── changelog.md
├── components/<component-name>/
│   ├── component.md
│   ├── component.css
│   └── <component-name>[-state].html
└── scripts/
    ├── generate-css.js
    ├── validate-tokens.js
    ├── token-utils.js
    └── style-template.css
```

The token utility, validator, generator, base-style template, and test helper in `scripts/` keep generation deterministic and formatting separate from project-specific base styles. Do not add a parallel token source, hand-edited global CSS, per-component token files, or duplicate component documentation without a concrete need.

## Decision ledger

Record these facts in `base-rules.md` or the nearest relevant artifact as soon as known:

- confirmed target platforms and minimum versions;
- framework and rendering technology;
- platform-specific input, navigation, typography, and safe-area constraints;
- approved visual direction and references;
- accessibility target and known project constraints;
- existing-system extension decisions.

Distinguish `Confirmed`, `Assumed`, and `Open` when a decision affects multiple phases. Do not turn an assumption into an approved design rule silently.

## Gates

1. **Direction gate:** Project facts and reference findings are summarized; the user confirms or corrects the direction.
2. **Rules gate:** `base-rules.md` is specific enough to make component decisions; the user reviews or approves it.
3. **Token gate:** Tokens validate as format-correct, aliases resolve, target platform implications are reviewed, and generated CSS is reproducible.
4. **Component gate:** The component has an approved specification and complete state classification before visual prototyping.
5. **Review gate:** Automated checks are run, manual findings are resolved or explicitly recorded, and no significant unresolved issue is mislabeled as reviewed.

A user may explicitly accept a risk, but acceptance must be recorded with scope and impact. Approval does not convert an accessibility failure into compliance.

When a format validator and generator support different subsets, report that difference explicitly. Core-format validity, project-tool support, and CSS representability are separate gates.

## Registry rules

Keep `components.md` concise and machine-readable. A practical row shape is:

```markdown
| Component | Purpose | Design status | Prototype status | Variants / States | Exceptions |
|---|---|---|---|---|---|
| Button | Triggers a project action | Approved | Completed | Primary; secondary; hover; focus; disabled; loading | None |
```

Use status values exactly as specified in `SKILL.md`. Do not use checkmarks, percentages, or ad-hoc status words. Link component folders or exception IDs when useful. The row summarizes state coverage; `component.md` remains authoritative for classification and requirements.

## State coverage contract

For every required state, `component.md` must identify:

| State | Classification | CSS handling | Static example | Unimplemented behavior |
|---|---|---|---|---|

Classification is one of:

- `CSS-reproducible`: native selectors and pseudo-classes can represent the visual state.
- `Static visual`: a predefined class or markup variant is needed to show a fixed visual state.
- `Functional behavior`: JS, application data, state management, or a real platform mechanism is required; document it and do not fake it.

Do not create a separate HTML file for a state that the base example can demonstrate through `:hover`, `:focus`, `:focus-visible`, `:active`, `:checked`, or similar CSS selectors. A state may need both a CSS rule and a static example when the visible result is application-controlled.

## Existing systems

Before creating a parallel system:

1. Identify reusable tokens, components, naming conventions, accessibility behavior, and platform patterns.
2. Decide whether the requested work extends, refactors, or explicitly replaces an existing system.
3. If replacement is requested, explain migration and compatibility impact and obtain explicit direction.
4. Keep a deferred migration list rather than silently changing unrelated callers.

## Changelog

Use meaningful entries in reverse chronological order:

```markdown
## 2026-11-25 — 0.1.0

- **Changed:** `design-tokens.json`, `style.css`
- **Summary:** Added semantic surface and text tokens; regenerated global CSS.
- **Reason:** Component contrast and dark-surface preparations require a shared role.
```

Omit whitespace changes, example wording tweaks, and regenerated output unless the generation architecture or public token API changed materially.

## Optional design intelligence

`ui-ux-pro-max-skill` is optional. Check the active skill catalog and standard installed-skill locations when the environment exposes them. Read its actual instructions before using it; never invent its recommendations and never overwrite its files.
