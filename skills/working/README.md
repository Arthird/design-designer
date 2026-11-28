# Working Skills

These installable skills perform design-system tasks:

- `design-designer` orchestrates the project workflow and delegates to the other working skills.
- `ui-type-discovery` researches platform-inspired UI libraries and prepares verified rendering plans.
- `design-coder` produces framework-independent static HTML/CSS/SVG component prototypes from approved specifications and rendering decisions.
- `design-auditor` performs expert design-system audits.
- `token-writer` authors and validates DTCG tokens and regenerates CSS.

Install one or more:

```bash
npx skills@latest add Arthird/design-designer --skill design-designer --skill ui-type-discovery --skill design-coder --skill design-auditor --skill token-writer
```

Use a pinned release ref for reproducible installs. `v2.1.1` is the current published release.

CLI discovery excludes `README.md`; installable units are the skill directories containing `SKILL.md`.
