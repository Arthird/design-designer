# Rendering Plan

## Status

`Draft`

Complete this plan only for a project that needs a specialized visual language or an external renderer. Change the status to `Approved` only after user or orchestrator approval. Use `Superseded` when a later verified plan replaces it. When copied into a project, rename this file to `design-system/rendering/rendering-plan.md`.

## Visual language

<Platform-like visual system the prototype should evoke>

## Target platform

<Actual target, for example framework-independent static web preview>

## Primary library

<Exact verified library or `Custom HTML/CSS/inline SVG`>

## Rendering priorities

1. Approved HTML/CSS UI-library component.
2. Inline SVG for justified static visual gaps.
3. Custom semantic HTML/CSS.

## JavaScript policy

No custom JavaScript or application behavior. <Record an explicitly approved library-runtime exception here, or state that none applies.>

## Dependencies

| Dependency | Exact version | Official source | License | Runtime / assets | Approval |
|---|---|---|---|---|---|
| <Library or asset> | <Version> | <URL> | <SPDX> | <Requirements> | <Approved / Pending> |

## Component mapping

| Component | Preferred renderer | Library or source | Fallback | Notes |
|---|---|---|---|---|
| <Component> | <Library, HTML/CSS, or inline SVG> | <Source> | <Fallback> | <State and limitation notes> |

## Accessibility and assets

- <Required semantic checks>
- <SVG exposure rules>
- <Asset-rights constraints>

## Known limitations

- Runtime behavior is illustrative.
- Native platform interactions are not implemented.
- <Other verified limitations>

## Approval

- Approved by: <role or user>
- Approval evidence: <date and short summary>
