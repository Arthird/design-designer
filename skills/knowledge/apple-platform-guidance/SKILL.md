---
name: apple-platform-guidance
description: Apply Apple Human Interface Guidelines when a project targets iOS, iPadOS, macOS, watchOS, tvOS, or another Apple platform. Use only after the Apple target and framework are confirmed; do not treat Apple conventions as universal web or Material rules.
metadata:
  short-description: Apple platform UI knowledge
  source-last-checked: "2026-11-26"
---

# Apple Platform Guidance

Provide platform-specific interface judgment for confirmed Apple targets. This knowledge skill informs requirements but does not implement native code or run device testing.

## Source of truth

- **Primary source:** Apple Human Interface Guidelines.
- **Official URL:** <https://developer.apple.com/design/human-interface-guidelines/>
- **Version/revision:** current online HIG; checked 2026-11-26.
- **Last checked:** 2026-11-26.

Source and update details are in [references/source-metadata.md](references/source-metadata.md).

## When to use

Use after confirming an Apple platform, OS minimum versions, device classes, input methods, and framework. Use for navigation, controls, typography, appearance, safe areas, gestures, adaptation, privacy, and platform integration decisions. This skill does not replace `web-accessibility`: use WCAG 2.2 and APG as a baseline, then separately evaluate Apple accessibility APIs and VoiceOver behavior in the native context.

Do not use for a web-only project even if it mimics Apple style, and do not use it to override applicable accessibility or security requirements.

## Decision procedure

1. Confirm the specific platform and framework. Ask if the target is genuinely ambiguous.
2. Find the relevant HIG page for the control, navigation, content, or system integration being designed.
3. Distinguish a platform convention from a technical restriction or accessibility implication.
4. Prefer native patterns and system capabilities when the product is native.
5. Define adaptations for compact/wide layouts, orientation, text scaling, Dynamic Type, appearance modes, safe areas, and supported input methods.
6. Require manual device/runtime verification for gestures, focus, system integration, and assistive technology.
7. Record deliberate deviations in the project exception log with user impact and approval status.

## Evaluation criteria

- Navigation matches Apple platform hierarchy and context.
- Controls behave as the platform expects instead of imitating a web control.
- Safe areas, text scaling, appearance modes, and input modalities are addressed.
- Platform-specific features are not appended to unrelated web rules.
- Accessibility and privacy risks are explicit.
- Untested native interactions are labeled unverified.
- Native accessibility is not treated as covered by a web audit; VoiceOver and platform API behavior remain separate verification.

## Output contract

State the platform, HIG area, selected convention, adaptation decisions, and what must be verified on-device.
