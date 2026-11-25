# Design-System Changelog

## 2026-11-25 — 0.1.0

- **Changed:** `base-rules.md`, `design-tokens.json`, generated `style.css`, `components/button/`
- **Summary:** Added a compact web example with semantic color, spacing, motion, typography, and button tokens; generated CSS; documented the button visual prototype.
- **Reason:** Provide a runnable reference for the design-system workflow, state classification, and deterministic token generation.
- **Reviewed:** Automated structural, token, BEM, generated-output, and no-prototype-JavaScript checks passed. Runtime keyboard and assistive-technology testing remain outside the static prototype scope.
- **Architecture:** Added the reusable token utility, deterministic generator, fixture checks, and contrast helper under `scripts/`; generated `style.css` from the token source and generator template.
- **Prototype:** Reduced the loading spinner to a static ring under `prefers-reduced-motion` and documented native disabled-focus behavior.
