---
name: design-coder
description: Create or revise framework-independent static HTML/CSS/SVG visual prototypes from an approved design-system specification and rendering decision. Use for approved UI kits, semantic markup, scoped BEM styling, inline SVG, CSS-reproducible states, and documented visual-only prototypes; do not use for JavaScript application logic, framework components, or production functionality.
metadata:
  short-description: Build static HTML, CSS, and SVG prototypes
---

# Design Coder

Produce a static visual prototype that demonstrates approved component design in HTML, CSS, an approved static UI library, and inline SVG where justified. It is not a functional implementation and does not become production-ready merely because its markup and styling are complete.

Respond in the language the user uses. Keep code, comments, headings, and TODOs in English unless the enclosing project has another documentation language.

For contributor-level acceptance checks, use the canonical [manual verification guide](https://github.com/Arthird/design-designer/blob/master/shared/workflow/manual-verification.md).

## Dependencies and checkpoints

Inspect skills by exact name before relying on them. Knowledge skills set rules; they do not edit files. Do not invoke the orchestrator or another working skill just to obtain knowledge.

| Dependency | Type | Checkpoint and trigger | Mandatory? | If unavailable |
|---|---|---|---|---|
| `design-tokens-standard` | knowledge | Before changing token semantics or deciding that a required global role is missing. Do not edit `design-tokens.json` yourself. | Mandatory only when a token-source change is required. | Hand the token need back to the orchestrator/user for `$token-writer`; do not invent a token. |
| `web-ui-foundations` | knowledge | Before selecting HTML elements, CSS state mechanisms, custom-property use, layout, or responsive rules for web output. | Mandatory for web prototypes. | Use only a documented project equivalent; otherwise stop before implementation and report the missing authority. |
| `bem-components` | knowledge | Before assigning block/element/modifier names or scoping component CSS when BEM is adopted. | Mandatory when the project uses BEM. | Use the project's documented alternative naming convention; do not silently mix systems. |
| `web-accessibility` | knowledge | Before finalizing any control, keyboard interaction, focus behavior, form, dynamic visual state, or accessibility claim. | Mandatory for web UI. | Preserve the component's stated requirements, mark verified accessibility as incomplete, and do not claim compliance. |
| `apple-platform-guidance` | knowledge | Before producing platform-specific behavior for a confirmed Apple target. | Mandatory only for Apple targets. | Do not replace it with web assumptions; leave Apple-specific behavior unresolved. |
| `material-platform-guidance` | knowledge | Before producing platform-specific behavior for a confirmed Material target. | Mandatory only for Material targets. | Do not replace it with web assumptions; leave Material-specific behavior unresolved. |
| `design-auditor` | handoff target | After the example and CSS are complete, before changing the prototype status to `Reviewed`. It is not invoked by this skill. | Mandatory for a reviewed status; coordinated by `design-designer` or the user. | Leave status at `Completed` at most and state that independent audit is outstanding. |
| `token-writer` | handoff target | When approved tokens are missing, invalid, or need a public semantic change. It is not invoked by this skill. | Mandatory for token changes; coordinated by `design-designer` or the user. | Hand off the token need; never hand-edit global CSS to bypass the workflow. |
| `ui-type-discovery` | handoff target | When a specialized visual language needs a renderer decision or the available rendering plan is missing, stale, or unsuitable. It is not invoked by this skill. | Optional; coordinated by `design-designer` or the user, never required for ordinary HTML/CSS. | Use an unambiguous custom HTML/CSS with inline SVG fallback only when it does not require unapproved dependencies; otherwise report the discovery handoff and do not implement a conflicting visual imitation. |

`design-coder` may consult knowledge skills. When a working dependency is required, it reports a handoff to the orchestrator/user rather than launching another working skill. This keeps direct invocation usable without creating a circular working-skill graph.

## Required inputs

When called directly, inspect the project before asking anything. Locate and read:

1. `design-system/base-rules.md`
2. target `design-system/components/<component-name>/component.md`
3. `design-system/components.md`
4. `design-system/design-tokens.json` and generated `design-system/style.css`
5. relevant entries in `design-system/exceptions.md`
6. `design-system/rendering/rendering-plan.md` and `library-registry.md` when present
7. existing project components and approved conventions

Ask only for a missing target component, approved design direction, platform constraint, or rendering decision that cannot be inferred. If `component.md` is absent or insufficient to determine variants and states, draft the specification with the user before prototyping. If a specialized visual language has no current approved plan, report the `$ui-type-discovery` handoff through `design-designer` or the user unless an unambiguous custom HTML/CSS/inline SVG fallback is already approved. Do not invent requirements or external dependencies to bypass either gate.

## Workflow

1. Confirm the target component, visual scope, actual target platforms, approved states, and rendering decision. Separate the target platform from the visual language: a web prototype styled like Windows, iOS, or a console remains a web prototype.
2. Validate the rendering decision. Reuse an `Approved` plan only when its visual language, exact versions, components, and runtime policy still apply. Treat missing or stale plans as a handoff unless an approved custom fallback resolves the task without a new dependency.
3. Check that `style.css` is fresh and generated from the current token source. If a generator exists, run the documented deterministic command. If no token source or generator exists, use the `token-writer` checkpoint; never manually edit global CSS.
4. Consult `web-ui-foundations` before choosing markup and CSS mechanics. Select the native element that expresses the component's meaning: button for action, link for navigation, labeled controls for input, and headings for structure.
5. If BEM applies, consult `bem-components`; name the primary component as the block and use `block`, `block__element`, and `block--modifier` consistently in HTML and CSS.
6. Choose the renderer per component in this order: an approved suitable HTML/CSS UI-library component; inline SVG for a justified platform-specific static visual not supplied by the library; custom semantic HTML/CSS. Do not mix a second library with a conflicting visual language.
7. Use a library exactly as its official setup requires. Use a pinned version, keep its CSS scoped or clearly documented, inspect global effects, and map its customization hooks to approved tokens where feasible. Do not rewrite a suitable library component merely to make it custom. Do not change token structure yourself; hand token changes to `$token-writer` through the orchestrator/user.
8. Use inline SVG only for static visual gaps that do not have a suitable semantic HTML/CSS implementation. Keep SVGs in the HTML document rather than separate assets unless a concrete need exists. Use `viewBox`, logical `<g>` groups, reusable primitives where justified, readable shapes, and `<title>` plus `<desc>` for informative graphics. Add `aria-hidden="true"` and `focusable="false"` to purely decorative SVG.
9. Keep all interactive controls as real HTML elements. A styled `<button>`, `<a href>`, `<input>`, `<select>`, `<textarea>`, or labeled native control must not become a drawn SVG interface. SVG may decorate an HTML control, not replace its semantics, focus, or name.
10. Style in the component's `component.css` using generated custom properties for shared roles. Scope library overrides and local exceptions to the component. Do not add a parallel global token source or hand-maintain shared CSS outside the generator's style template.
11. Classify and implement every state. Use native selectors and pseudo-classes for CSS-reproducible states; use fixed modifiers/static examples for states CSS cannot reach; document functional behavior as unimplemented.
12. Consult `web-accessibility` for semantic names, labels, focus, keyboard expectations, contrast implications, SVG exposure, and dynamic state requirements. If behavior needs JavaScript, document it and add an actionable TODO. Never add script or simulated application behavior.
13. For a confirmed native target, consult only the matching Apple or Material knowledge skill and document any platform-specific expectation that cannot be verified in a static prototype. A visual-language resemblance alone is not a native target.
14. Update `component.md` state coverage if implementation decisions correct a classification. Record the chosen renderer and constraints in its optional `Visual rendering` section when specialized.
15. Write `design-system/rendering/rendering-report.md` when an approved plan or specialized renderer was used. Record the selected renderer, library/source, version, SVG use, simplifications, dependencies, visual limitations, and unverified behavior.
16. Update `components.md` only after the files, state coverage, rendering report, and caveats agree.
17. Hand off to `$design-auditor` after completion or recommend it to the user. Fix material prototype defects before `Completed`; use `Reviewed` only when an audit is complete and significant issues are resolved or explicitly recorded.

## Rendering priorities

Apply these priorities per component, not as a demand to use a library everywhere:

1. **Approved HTML/CSS UI library:** use real components and classes from the plan, with official setup, pinned version, token adaptation, and scoped overrides.
2. **Inline SVG:** use for a justified static platform visual when no usable library or semantic HTML/CSS representation covers it. Preserve native controls and text.
3. **Custom semantic HTML/CSS:** use when it is clearer, more maintainable, or necessary for semantics, responsive reflow, theming, or accessibility. This is a complete fallback, not a failure.

Inline SVG is useful for window controls, title-bar decoration, status indicators, platform-specific static chrome, icons, console/game ornaments, and bounded diagrams. Do not draw an entire screen as one SVG, set ordinary prose as SVG paths, or create complex paths where simple HTML/CSS primitives communicate the same design.

## Dependency policy

Prefer, in order, an existing suitable dependency, an approved CSS-only library, local approved resources, an exact-version official CDN when external loading is permitted and documented, then custom HTML/CSS/inline SVG. Never use a `latest` URL. Do not download, install, bundle, or add npm dependencies unless the user approves the dependency change. Before requesting approval, show the name, exact version, official source, license, runtime dependencies, reason, and limitations. Do not copy code or assets until the license and distribution conditions are verified, and do not use platform logos, proprietary screenshots, fonts, sounds, or artwork without documented rights.

Third-party JavaScript required by a Web Components library is distinct from custom application behavior, but it does not bypass the prototype's JavaScript constraint. Use such a library only when the rendering plan records and the user approves the runtime-policy exception. Framework-specific React/Vue/Angular packages do not become the default framework-independent renderer.

## State rules

- **CSS-reproducible:** hover, focus-visible, active, checked, and CSS-representable disabled states. Prefer native selectors; do not create permanent fake-state modifiers for these.
- **Static visual:** loading, error, success, empty, or application-controlled selected/expanded presentation. Use a clearly named modifier and a static example only where needed.
- **Functional behavior:** submission, data loading, application validation, real menu opening/closing, routing, or state mutation. Document it; do not implement it.

Static examples must not imply a real transaction occurred. A `.alert--success` example may show a success appearance but must not claim that validation ran.

## Files and naming

Use the default structure unless the project documents another:

```text
design-system/
├── style.css                         # generated; never hand-edit
└── components/<component-name>/
    ├── component.md
    ├── component.css                 # scoped component styling
    └── <component-name>[-state].html # one base and needed static states
```

Each HTML example links `../../style.css` and `./component.css`, plus an approved pinned library stylesheet or module when the plan requires it. Use the component block for local scope; avoid element-wide rules, IDs for styling, sibling-component selectors, deep descendant chains, and unrelated global overrides. Shared structural CSS belongs in the generator's template mechanism, not in a component file. Library CSS must not leak uncontrolled global changes into other components.

## Output contract

End with an honest label such as: `Visual prototype: semantic HTML, CSS, approved renderers, and static SVG examples complete; functional behavior remains unimplemented.` Report components created, approved libraries and exact versions, HTML/CSS-only components, inline SVG components, simplified components, visually represented states, dependencies still needing approval, rendering-report status, remaining limitations, and audit status. Never call the result a native application, framework implementation, or production-ready component.
