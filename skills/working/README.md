# Working Skills

These installable skills perform design-system tasks:

- `design-designer` orchestrates the project workflow and delegates to the other working skills.
- `design-coder` produces CSS-only visual component prototypes.
- `design-auditor` performs expert design-system audits.
- `token-writer` authors and validates DTCG tokens and regenerates CSS.

Install one or more:

```bash
npx skills@latest add Arthird/design-designer --skill design-designer --skill design-coder --skill design-auditor --skill token-writer
```

CLI discovery excludes `README.md`; installable units are the skill directories containing `SKILL.md`.
