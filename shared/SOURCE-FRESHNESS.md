# Source Freshness Policy

Each knowledge skill owns its primary source metadata in its own `SKILL.md` and `references/source-metadata.md`, directly next to the domain rules it supports. There is no central source catalog.

## Required metadata

Record:

- primary source name;
- official URL;
- relevant version or revision;
- last-checked date;
- supporting sources that clarify but do not override the primary source.

## Review process

Before a release that changes a knowledge domain:

1. Open the primary source and confirm that its relevant normative or guidance content is unchanged.
2. Check the version or revision in the skill metadata against the source.
3. Review supporting sources for a conflict; update the knowledge rule if the primary source has changed.
4. Record the new date and update revision details only when there was a meaningful check or change.
5. Re-run the affected manual workflow in `shared/workflow/manual-verification.md`.

An unavailable source or a network failure is not permission to invent fresh guidance. Preserve the last checked date, document the inability to verify, and avoid relying on unstable claims until checked.

## Source hierarchy

- Normative standards control format and accessibility requirements.
- Official platform documentation controls platform conventions.
- Official implementation documentation informs tool behavior but does not replace a normative standard.
- Design intelligence is a recommendation source only.

When sources conflict, identify the applicable domain and explain the conflict rather than merging rules into a universal checklist.
