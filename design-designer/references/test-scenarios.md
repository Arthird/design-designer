# Test Scenarios

Use these as behavioral acceptance scenarios. They test decisions and deliverables, not exact prose. Follow the supplied automated harness for mechanical checks.

## 1. New responsive web product

Prompt: “Create a design system for a responsive account dashboard. Use the existing React app, semantic HTML, and a calm editorial style. Audit it after building a button and input.”

Expected behavior:

- inspects the repository before asking questions;
- distinguishes the approved HTML/CSS visual prototype from the React production implementation;
- checks for `ui-ux-pro-max-skill` and either uses it honestly or states it is unavailable;
- establishes web-specific requirements and accessibility goals;
- documents rules and obtains a direction/rules review point;
- delegates tokens to `$token-writer`, prototypes to `$design-coder`, and review to `$design-auditor`;
- does not add JavaScript to prototype folders;
- does not mark unresolved accessibility problems as `Reviewed`.

## 2. Native mobile project

Prompt: “Our iOS app needs a component system. We already have Swift design constants and no website.”

Expected behavior:

- does not default to web CSS or a responsive website;
- inspects the native project and platform conventions;
- adapts the token conversion and component validation plan to iOS;
- does not claim HTML prototypes validate native interaction or accessibility;
- retains `design-tokens.json` as a design interchange source only when useful and documents platform conversion.

## 3. Existing design system

Initial workspace: existing tokens, CSS variables, and a button implementation with established class names.

Prompt: “Add a destructive button without disrupting the current visual language.”

Expected behavior:

- discovers and reuses the existing system rather than creating a duplicate;
- preserves existing conventions where sound;
- records any local exception and accessibility reasoning;
- updates registry and changelog;
- adds no JavaScript for visual button states.

## 4. Direct design-coder invocation with a missing spec

Prompt: “Use `$design-coder` to make a loading button for this project.”

Expected behavior:

- inspects project files before asking;
- locates approved design rules and tokens;
- requests or drafts only the missing component requirements;
- uses a static loading example while leaving request behavior unimplemented;
- updates prototype status without describing the result as a functional implementation.

## 5. Direct token-writer invocation with a conflicting value

Prompt: “Use `$token-writer` to make muted text #cccccc on white because I prioritize visual softness.”

Expected behavior:

- checks project rules and platform constraints;
- calculates/reviews contrast and explains the WCAG risk without claiming automated certification;
- asks whether the user intentionally wants to proceed;
- records an explicit exception/risk if approved instead of silently changing the global rule;
- still validates token format and generates CSS deterministically.

## 6. Direct design-auditor invocation

Prompt: “Use `$design-auditor` on `design-system/`.”

Expected behavior:

- separates automated and manual checks;
- reports missing required files and token errors with actionable locations;
- checks CSS/HTML prototype restrictions but does not claim runtime keyboard or screen-reader validation;
- identifies registry states that do not match evidence;
- keeps accepted risks distinguishable from compliance.

## 7. Token formats and failure cases

Expected:

- valid JSON and explicit/inherited/aliased types pass;
- malformed JSON fails clearly;
- unresolved `{token}` references fail;
- `$ref` targets and property-level types are checked;
- circular aliases and `$extends` fail;
- unsupported color spaces or units fail format validation;
- incomplete shadow/border/transition/typography values fail;
- unsupported CSS mapping fails generation rather than silently emits wrong CSS.

## 8. Accessibility conflict and user override

Prompt: “Use 10px grey text on a white background. I accept the accessibility risk.”

Expected behavior:

- explains the applicable readability/contrast and zoom concerns;
- asks for explicit confirmation of the requested deviation;
- records the component/global scope and known risk in `exceptions.md`;
- does not label the system as accessible or fully reviewed.

## 9. Optional integration unavailable

Initial workspace: no `ui-ux-pro-max-skill` installed.

Prompt: “Use UI UX Pro Max for the palette.”

Expected behavior:

- checks actual availability;
- states it is unavailable when relevant;
- continues using project requirements and available standards;
- never claims recommendations came from the absent skill.

## 10. Unsupported functionality in a prototype

Prompt: “Make the menu actually open and close without leaving HTML/CSS.”

Expected behavior:

- explains that opening/closing is functional behavior and CSS alone cannot reliably implement the full application interaction;
- documents the expected production behavior and leaves a TODO;
- may show a static expanded visual state with correct semantics;
- does not write JavaScript or imply the interaction works.

## 11. Independent subskill installation

Initial workspace: only one subskill directory, with the other skills absent and no project design system yet.

Expected behavior:

- the subskill loads without needing a sibling skill directory;
- its local `SKILL.md` and `references/` links resolve;
- it inspects the project and asks only for the missing design-system context needed for its own task;
- it reports the missing upstream artifacts and does not fabricate approved rules, tokens, or specifications;
- it can recommend the relevant sibling or orchestrator without claiming that specialist ran.

## 12. Orchestrator handoff

Initial workspace: inspected project facts, approved base rules, and a component specification with complete state classification.

Prompt: “Continue through tokens, the visual prototype, and audit.”

Expected behavior:

- invokes `$token-writer` for the token source and CSS regeneration;
- invokes `$design-coder` only after the relevant component specification is sufficiently approved;
- invokes `$design-auditor` after tokens, initial specs, and prototypes;
- passes source artifacts and decision context instead of asking the user to repeat them;
- updates registry, exceptions, and changelog based on the actual outcomes;
- does not declare `Reviewed` while significant findings remain.

## 13. Missing or incomplete project artifacts

Initial workspace: a partial `design-system/` with a registry row, no component folder, and a component spec missing accessibility guidance.

Expected behavior:

- identifies missing required files and directories;
- reports which component specification sections or state classifications are incomplete;
- distinguishes a missing baseline artifact from an implementation defect;
- does not invent completed evidence or mark the component reviewed;
- creates or updates only the artifacts needed to restore the documented contract.

## 14. Project-language behavior

Prompt in Russian: “Создай визуальный прототип кнопки по утверждённой спецификации.”

Expected behavior:

- communicates in Russian during the task;
- keeps repository instructions and generated artifact documentation in English unless the project has already chosen another documentation language;
- does not translate established token names or BEM classes without a documented reason.
