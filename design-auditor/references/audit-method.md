# Audit Method

## Evidence order

Use evidence in this order:

1. Explicit project requirements and approved design artifacts.
2. Actual platform and framework constraints visible in the project.
3. Applicable normative standards.
4. Project conventions and established implementation patterns.
5. Expert judgment.

When project instructions conflict with accessibility requirements, record the conflict. Do not silently downgrade the issue because the user approved the artifact.

## Token audit

- Validate JSON parsing and the 2025.10 token/group distinction: an object with `$value` is a token and cannot also contain child tokens.
- Require every token to have an explicit or inherited `$type`, or resolve its type from an alias.
- Reject names that start with `$` (except the reserved `$root`) or contain `{`, `}`, or `.`.
- Resolve full-value `{group.token}` and supported `#/json/pointer` references, detect unresolved targets and cycles, and validate referenced token types where the composite context requires them.
- Check `$extends` chains separately from token aliases when present; verify target is a group and no cycles exist.
- Include inherited tokens in generated output checks and verify their inherited types and values, not only explicitly declared local tokens.
- Validate value shapes for the supported types rather than guessing from names.
- Review whether `px`/`rem`, color spaces, alpha/fallback colors, and composite values are sensible for each target platform. This is design/platform review, not token-format validity.
- Deprecated tokens should have a migration path when the project has active usage.

## Generated CSS audit

`style.css` should be reproducible from `design-tokens.json` plus the generation template. If the project generator exists, regenerate to a temporary comparison or run its check and compare deterministically. Do not edit generated CSS while auditing; test harnesses may use a temporary copy.

The generator needs clear failures for invalid JSON, unresolved references, cycles, and unsupported token types. A successful generator run does not prove platform suitability or design quality.

## BEM and selector audit

Extract class selectors from each component's CSS. Verify they are scoped under expected blocks and do not target sibling blocks accidentally. Extract class names used in HTML and report typo or missing-style risks where machine inference is reliable. Consider dynamic/modifier classes documented in the component spec as expected.

Avoid reporting every global utility class as a BEM violation. The rule applies to component prototype CSS; generated global styles and intentional project utilities follow their own documented architecture.

## Accessibility audit limits

Machine checks can calculate documented normal-text contrast, detect obvious missing labels in static markup, verify alt text presence, and confirm focus-related CSS exists. They cannot prove keyboard operation, screen-reader behavior, dynamic announcements, target spacing under all conditions, zoom/reflow quality, or the correctness of ARIA interactions across platforms.

Manual checks should include:

- accessible names and roles;
- tab order and visible focus;
- keyboard patterns appropriate to the semantic widget;
- error identification and instructions;
- color not used as the only carrier of meaning;
- text zoom, reflow, long content, and high-contrast assumptions;
- touch-target and platform gesture constraints where relevant.

## Contrast evidence

Only calculate contrast when both foreground and background are available as resolvable sRGB colors and the design documentation connects them as a usage pair. State the pair and calculated ratio. WCAG thresholds depend on text size, weight, component role, and state; cite the applicable criterion and do not assume every usage qualifies as normal text. Non-text contrast is a separate review.

## Report shape

```markdown
## Audit summary

Automated: PASS (format + cross-file checks)
Manual: 1 High, 2 Medium findings
Skipped: runtime keyboard testing
Review status: Not ready for Reviewed due to A11Y-001

| ID | Severity | Location | Finding | Explanation | Correction | Basis |
|---|---|---|---|---|---|---|
| A11Y-001 | High | ... | ... | ... | ... | WCAG 2.2 ... |
```

Do not collapse automated PASS into an accessibility certification statement.
