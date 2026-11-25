# Visual Prototype Rules

## HTML semantics and accessibility

- Use the native element that matches the component's behavior: `<button>` for actions, `<a href>` for navigation, `<input>`/`<select>`/`<textarea>` for fields, and headings for document structure.
- Preserve a logical reading order and visible focus. Do not remove focus outlines unless the replacement meets the project's approved accessibility criteria.
- Associate labels with form fields using `for`/`id`. Use explicit text for icon-only controls and appropriate names for form controls.
- Use ARIA only when native semantics cannot express the required meaning. Follow the applicable [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) pattern and mark behavior that requires JavaScript as unimplemented.
- Static success/error examples should demonstrate the presentational state without claiming a real transaction or data change occurred.

## CSS architecture

```css
.button {
  color: var(--color-text-on-accent);
}

.button__icon {
  /* Element belonging to .button */
}

.button--secondary {
  /* Visual variant */
}

.button:focus-visible {
  /* Native visual state */
}
```

The block should match the component name, using lower-case hyphenated words when needed. Element and modifier names may use hyphens within their segment. Keep all component classes under one block unless an approved composition relationship requires another local block; document dependencies in `component.md`.

Choose state syntax deliberately: use a modifier such as `.button--secondary` for a durable visual variant, and a state modifier only when the prototype needs a fixed application-controlled presentation. Do not encode transient native hover/focus as a permanent modifier unless the component spec explicitly requires it for a documented exception.

Use CSS custom properties for global design roles. Local literals are acceptable for genuinely component-specific values such as a grid span or a one-off optical adjustment, but they must not recreate a global token under another name.

Use responsive rules intentionally rather than assuming a breakpoint. Reuse project breakpoints from the rules or tokens when available. Content should remain usable at narrow and wide widths and with increased text size or zoom.

## State representation decision table

| Requirement | Preferred representation | Separate HTML example? |
|---|---|---|
| Pointer hover | `:hover` plus `@media (hover: hover)` when needed | No |
| Keyboard focus | `:focus-visible` | No |
| Pressed/active | `:active` when appropriate | No |
| Native checked/disabled | `:checked`, `:disabled` | No, unless the static visual cannot be seen without interaction |
| Application-controlled loading/error/success | explicit modifier with static content | Usually yes |
| Expanded/selected menu state | explicit modifier and correct semantic state | Only when needed to show the fixed presentation; behavior remains TODO |
| Form submission/data change | none; document requirement | No behavior simulation |

Do not generate a matrix of every pseudo-class as separate HTML. Show native interactions in one or two representative examples, and use static files for genuinely fixed visual states.

## Behavior documentation

When behavior is out of scope, write an actionable TODO in `component.md` and, where a reviewer might otherwise infer behavior, in the nearest HTML example. Describe what the production layer must do, what state it must expose, and which visual behavior the prototype only approximates. Never add script, event handlers, fake timers, data fetches, or synthetic interaction behavior.
