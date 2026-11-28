# Working Skills

These installable skills perform design-system tasks:

[@README.md#L7:9](file:///home/tema/projects/skills/design-designer/README.md#L7:9)

<context ref="file:///home/tema/projects/skills/design-designer/README.md#L7:9">
<!-- VERSION:START -->
**Current version:** v2.2.0
<!-- VERSION:END -->

</context>

- `design-designer` orchestrates the project workflow and delegates to the other working skills.
- `ui-type-discovery` researches platform-inspired UI libraries and prepares verified rendering plans.
- `design-coder` produces framework-independent static HTML/CSS/SVG component prototypes from approved specifications and rendering decisions.
- `design-auditor` performs expert design-system audits.
- `token-writer` authors and validates DTCG tokens and regenerates CSS.

Install one or more:

```bash
npx skills@latest add Arthird/design-designer@v2.2.0 --skill design-designer --skill ui-type-discovery --skill design-coder --skill design-auditor --skill token-writer
```

Use a pinned release ref for reproducible installs. Use the current release from the README context above.

CLI discovery excludes `README.md`; installable units are the skill directories containing `SKILL.md`.
