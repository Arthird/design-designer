# Implementation Plan

## Example order

1. **Button** — foundational action component; simple state coverage; useful for validating token and CSS architecture.
2. **Input** — follows once field tokens, labels, help/error presentation, and focus behavior are approved.
3. **Select/combobox** — depends on input and platform-specific interaction decisions; requires a real functional implementation outside this visual prototype system.

## Review gates

- Confirm an approved component specification before prototyping.
- Generate CSS after token changes.
- Audit after the first prototype and before setting `Reviewed`.
- Keep unavailable runtime behavior as an explicit TODO and functional requirement.
