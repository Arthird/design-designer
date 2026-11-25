---
name: design-auditor
description: Audit a project design system's rules, tokens, component specifications, registry, semantics, BEM CSS, responsiveness, exceptions, and static prototypes. Use for automated and expert design-system review with actionable severity-ranked findings; not for implementing fixes or certifying complete accessibility.
metadata:
  short-description: Audit design systems and prototypes
---

# Design Auditor

Review the design system against the project's approved rules and applicable standards. Produce findings that an engineer or designer can act on. Do not mutate artifacts during an audit unless the user also asks for fixes; if asked for fixes, separate the audit baseline from the corrections.

Respond in the language the user uses. Keep report headings and artifact paths in English unless the project uses another report language.

Read [references/audit-method.md](references/audit-method.md) before running or interpreting checks. Use [../design-designer/references/sources.md](../design-designer/references/sources.md) for primary links; cite a specific requirement only when it supports a finding.

## Scope

When called directly, inspect the repository and audit only what exists. Locate `design-system/base-rules.md`, `design-tokens.json`, `style.css`, `components.md`, `exceptions.md`, and relevant component folders. Ask only which subset is requested when the full system is too large or the target is ambiguous.

Audit these areas as applicable:

- consistency with approved `base-rules.md` and project platform constraints;
- token JSON validity, group/token structure, types, values, names, aliases, references, and cycles;
- token compatibility with the actual target platforms and generated CSS;
- machine-checkable color contrast where color pairs and usage are documented;
- component specification completeness, variants, state classification, and implementation coverage;
- registry status and current state-summary accuracy;
- semantic HTML, accessible names, labels, native control use, and static ARIA correctness;
- CSS and BEM naming, scope, selector conflicts, and generated-file custody;
- responsive behavior and content robustness;
- visual consistency with rules and local exceptions;
- exception scope, approval, and explicit accessibility risk;
- absence of JavaScript or simulated application behavior in visual prototypes.

## Two-layer audit

### Automated

Run the bundled tool from the audited project:

```bash
node /path/to/design-auditor/scripts/audit-design-system.js design-system
```

It checks required files, token format and references through the project's validator, generated CSS freshness when the generator exists, CSS/HTML class extraction, forbidden prototype JavaScript, registry status values, and documented contrast pairs. Treat an unavailable check as `SKIPPED`, not `PASS`.

When auditing the bundled example, use the project's `validate-tokens.js` as the format authority and the auditor as the additional cross-file reviewer. Automated results are limited to the assertions actually run.

### Manual and AI-assisted

Inspect the visual and semantic design beyond what scripts can assert:

- Is the direction coherent with the project and references?
- Do typography, spacing, hierarchy, color roles, and density form a usable system?
- Are component variants purposeful, and are states complete for expected use?
- Are focus order, keyboard operation, semantics, labels, and announcements plausible?
- Are native platform interaction conventions respected?
- Does responsive layout preserve priority, readability, targets, and content without misleading truncation?
- Are static examples clearly visual-only and free of fake behavior?
- Are exceptions limited and both approved and risk-aware?

Consult WCAG 2.2, the ARIA Authoring Practices, MDN, HTML, and relevant platform guidance when needed, especially for components with interactive semantics. Do not infer untested runtime behavior from static files.

## Findings

Report each finding with:

| Field | Requirement |
|---|---|
| ID | Stable short identifier such as `A11Y-001` |
| Severity | `Critical`, `High`, `Medium`, `Low`, or `Info` |
| Location | File and selector/line/section or token path |
| Finding | Observable failure or uncertainty |
| Explanation | Why it matters for UX, platform, or accessibility |
| Correction | Specific recommended action |
| Basis | Project rule, standard requirement, or manual judgment |

Use `Critical` for blocking accessibility or severe cross-platform breakage, `High` for likely user-blocking or broadly inconsistent behavior, `Medium` for meaningful quality/coverage defects, `Low` for local polish or maintainability, and `Info` for evidence neutral to pass/fail. A contrast result alone does not prove complete accessibility.

Separate verified failures from risks and unknowns. An unexercised interaction must not be reported as passing. Include a short summary of automated checks, manual review coverage, skipped checks, and the highest-risk unresolved item.

## Registry and review status

Do not mark or recommend `Reviewed` when a significant unresolved issue remains. Approval to defer a finding does not make the component compliant; retain the risk in exceptions or the audit summary with an owner and scope when the project supports it.
