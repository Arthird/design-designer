# Platform and UI Rendering Catalog

Use this catalog as a starting point for `ui-type-discovery`, not as a closed list or a pre-approved dependency set. Search terms and candidate names help begin research; project-specific verification is still required.

## Source policy

- Metadata in this catalog was checked against official project sites, repositories, README files, manifests, and releases on **2026-11-28**.
- “Metadata checked” means the official source supports the listed repository, license, version, and implementation type. It does **not** mean the library was browser-tested, accessibility-tested, or approved for every project.
- No candidate is automatically `Recommended`. A project record must verify the exact scope before selection.
- When an official repository, license, runtime, or current version is not confirmed, the candidate remains `Not verified`.

## Search directions

Use combinations of:

- platform or era name + `UI kit`;
- platform or era name + `HTML CSS library`;
- platform or era name + `web components`;
- official design-system name + `components`;
- official design system or HIG used as a visual reference;
- `CSS-only`, `no JavaScript`, `semantic HTML`, `static UI`, and `design system`.

Also search for implementations not listed here. For proprietary platforms, look for official design guidance and documented visual patterns before assuming a community kit is accurate or lawful.

## Selection architecture

Keep these fields separate:

| Field | Example |
|---|---|
| Target platform | Web |
| Visual language | Windows 11 Fluent |
| Desired prototype scope | Static settings window and action buttons |
| Rendering strategy | CSS-only kit, semantic HTML/CSS, or inline SVG |
| Native behavior | Not implemented; do not infer APIs from the visual language |

For a specialized language, the discovery order is:

1. Existing appropriate project dependency.
2. Approved CSS-only or static HTML/CSS library.
3. Local approved resources with known provenance.
4. Exact-version official CDN, only when external loading is permitted.
5. Custom semantic HTML/CSS with inline SVG for justified static visuals.

## Starter candidates with checked metadata

These rows are research leads. The assessment is intentionally conservative for the current static, no-custom-JavaScript prototype policy.

| Candidate | Direction | Official source | Version / activity checked | License | Implementation type | Runtime / build notes | Catalog assessment |
|---|---|---|---|---|---|---|---|
| Web Awesome | General web components; successor to Shoelace | <https://webawesome.com/>; <https://github.com/shoelace-style/webawesome> | v3.15.0; repository activity 2026-11-24 | MIT | Web Components | Lit/Web Components runtime; npm/CDN; build optional for CDN use | Suitable with limitations; requires an explicitly approved runtime-policy change |
| Shoelace | General web components; predecessor to Web Awesome | <https://shoelace.style/>; <https://github.com/shoelace-style/shoelace> | v2.20.1; repository archived | MIT | Web Components | Lit runtime; migration to Web Awesome expected | Reference only; do not start a new no-JS workflow with archived Shoelace |
| Bootstrap | General web UI framework | <https://getbootstrap.com/>; <https://github.com/twbs/bootstrap> | v5.3.9 stable; v6.0.0-alpha.2 is a prerelease | MIT | CSS-only subset plus HTML/CSS snippets | Interactive components can require Bootstrap JavaScript; CSS can be used alone | Suitable with limitations; generic visual language, not a turnkey platform recreation |
| Bulma | General CSS framework | <https://bulma.io/>; <https://github.com/jgthms/bulma> | 1.0.4; repository activity 2026-11-24 | MIT | CSS-only | No JavaScript shipped; Sass customization available | Suitable with limitations; generic visual language |
| Pico CSS | Minimal semantic CSS | <https://picocss.com/>; <https://github.com/picocss/pico> | v2.1.1 final release; repository archived | MIT | CSS-only | No framework runtime | Suitable with limitations; unmaintained final release |
| Pure.css | Small responsive CSS modules | <https://purecss.io/>; <https://github.com/pure-css/pure> | v3.1.0; repository activity 2026-11-25 | BSD-3-Clause | CSS-only | No JavaScript runtime for CSS modules | Suitable with limitations; generic and intentionally minimal |
| Fluent UI Web Components | Windows 11 / Fluent 2-inspired web UI | <https://developer.microsoft.com/fluentui>; <https://github.com/microsoft/fluentui/tree/master/packages/web-components> | `@fluentui/web-components` 3.2.5; repository activity 2026-11-28 | MIT for the web-components package; review repo-level third-party notices/assets separately | Web Components | JavaScript/Web Components runtime; theming uses CSS variables | Suitable with limitations; not automatic under no-JS policy; Fluent 2 site is the design reference |
| 98.css | Windows 98 / Classic Windows | <https://jdan.github.io/98.css/>; <https://github.com/jdan/98.css> | 0.1.18; last significant repository activity 2025-09-07 | MIT | CSS-only | Styles semantic HTML; no JavaScript; assets included by the project | Suitable with limitations; verify component coverage and accessibility per project |
| XP.css | Windows XP / Luna | <https://botoxparty.github.io/XP.css/>; <https://github.com/botoxparty/XP.css> | v0.2.6; last significant repository activity 2025-03-08 | MIT | CSS-only | Built on 98.css; no JavaScript; one theme at a time | Suitable with limitations; historical visual imitation, not native Windows |
| 7.css | Windows 7 / Aero | <https://khang-nd.github.io/7.css/>; <https://github.com/khang-nd/7.css> | v0.21.0; repository activity 2026-09-30 | MIT | CSS-only | Built on XP.css/98.css lineage; no JavaScript | Suitable with limitations; verify visual and accessibility coverage |
| System.css | Classic Mac OS / System 6 | <https://sakofchit.github.io/system.css/>; <https://github.com/sakofchit/system.css> | No GitHub release found; repository activity 2023-11-26 | MIT | CSS-only | No JavaScript; project describes itself as beta | Suitable with limitations; historical Apple-inspired visual language, not modern macOS |
| PSone.css | PlayStation 1-inspired retro UI | <https://github.com/micah5/PSone.css> | No GitHub release found; repository activity 2026-10-19 | MIT | CSS-only | Single CSS file; community visual interpretation; no mature release process evidenced | Suitable with limitations; verify completeness and provenance of screenshots/assets |
| WebTUI | Terminal / TUI-inspired web CSS | <https://webtui.ironclad.sh>; <https://github.com/webtui/webtui> | 0.1.10; repository activity 2026-10-12 | MIT | CSS-only CSS library | CSS package and import setup; no application JS required for selected styles | Suitable with limitations; inspect exact package and accessibility behavior before use |
| NES.css | 8-bit / NES-inspired retro UI | <https://nostalgic-css.github.io/NES.css/>; <https://github.com/nostalgic-css/NES.css> | v2.3.0 release; repository activity 2024-01-17 | MIT | CSS-only | Components only; fonts are separate; browser support documented for current Chrome/Firefox/Safari | Suitable with limitations; stale release and incomplete language coverage |
| Material Web | Material Design 3 / Android-inspired web components | <https://m3.material.io/>; <https://github.com/material-components/material-web> | v2.5.0; repository activity 2026-11-25; project states maintenance mode pending maintainers | Apache-2.0 | Web Components | JavaScript/Web Components runtime; some examples use import maps and module scripts | Suitable with limitations; not automatic under no-JS policy; do not treat it as native Android |
| BOOTSTRA.386 | DOS / terminal / retro Bootstrap theme | <https://kristopolous.github.io/BOOTSTRA.386/>; <https://github.com/kristopolous/BOOTSTRA.386> | No GitHub release found; repository activity 2026-11-04 | Apache-2.0 | HTML/CSS snippets / Bootstrap theme | Requires Bootstrap and project JS for documented behavior; README notes JS dependence | Rejected for the current no-JS workflow unless the user explicitly expands runtime scope |
| RPGUI | Old-school RPG / fantasy game UI | <https://github.com/RonenNess/RPGUI> | v1.0.3 release; repository activity 2023-10-08 | GitHub metadata reports NOASSERTION; review the repository license and assets before use | HTML/CSS snippets | README requires CSS, JavaScript, and image assets for documented use | Rejected for the current no-JS workflow; do not copy assets before a license review |

## Linux and platform references

These are useful sources for visual-language research, but the official projects are not automatically portable CSS libraries:

- GNOME Shell / Adwaita: use official GNOME design documentation and current GNOME applications as visual references. The GNOME Shell repository is GPL-2.0 and is not an HTML component package.
- KDE Plasma / Breeze: use official Plasma design and the KDE Breeze repository as visual references. The repository contains desktop artwork and style assets, not a framework-independent HTML component kit with a verified license for copying into a prototype.
- adwaita.css: repository metadata did not expose a confirmed license, and the project has no activity after 2022. Treat it as `Not verified`; do not copy it.
- Windows 10: use official Microsoft design guidance and Fluent references. A GTK desktop-theme repository is not an HTML UI kit.
- Modern macOS and iOS: use Apple HIG for visual guidance only when the visual language is intentional. Do not represent an HTML reconstruction as native macOS or iOS.

## Starter names awaiting official-source verification

These names were requested as starting points, but an authoritative current HTML/CSS package, license, and runtime were not confirmed during this catalog pass. Search again with the candidate name plus `official repository`, `documentation`, and `license`; record a source only when it is verifiably official.

- Windows UI Web.
- Puppertino.
- Other macOS / iOS visual-language implementations.
- Material Design 3 Web Components implementations other than Material Web.
- GNOME UI / Adwaita HTML kits other than the unverified `adwaita.css` lead.
- KDE Breeze HTML kits.
- TERMINAL-Kit.
- OldwebUI.
- Retro Design System.
- Steam UI / Steam Deck CSS projects.
- Xbox-inspired UI projects.
- PlayStation-inspired UI projects other than PSone.css.

Do not assume these names identify mature projects. Search results may be unrelated, renamed, archived, or license-unclear.

## Platform search map

Use the map to choose search terms, then verify candidates. A missing mature kit is a valid result.

| Direction | Search lead | Likely source strategy |
|---|---|---|
| Windows 11 / Fluent 2 | Fluent UI design guidance; Fluent Web Components; Fluent tokens/icons | Official guidance plus an approved Fluent-compatible renderer; custom fallback |
| Windows 10 | Microsoft design guidance; older Fluent references; existing 7.css/98.css comparisons | Reference-led custom or vetted retro kit |
| Windows 7 / Aero | `7.css` | CSS-only candidate after project verification |
| Windows XP / Luna | `XP.css` | CSS-only candidate after project verification |
| Windows 98 / Classic Windows | `98.css` | CSS-only candidate after project verification |
| Windows 3.1 / Windows 95 | Classic Windows visual references; search `Windows 95 UI CSS` and `Windows 3.1 UI CSS` | Reference-led custom or vetted retro kit; verify the exact era |
| Modern macOS | Apple HIG; current system screenshots with lawful usage | Reference-led custom HTML/CSS/inline SVG |
| Classic Mac OS / Aqua | Classic Mac and Mac OS X Aqua references; `System.css` for the older monochrome era | Historical CSS candidate or custom fallback; distinguish System 6 from Aqua |
| GNOME / Adwaita | GNOME HIG; GNOME applications | Reference-led custom; do not copy GPL implementation assets without review |
| KDE Plasma / Breeze | KDE design guidance; Breeze assets | Reference-led custom; license review required |
| iOS / iPadOS | Apple HIG; platform visual studies | Web visual reconstruction, never native claim |
| Android / Material 3 | Material 3 guidance; Material Web | Approved Web Components only with runtime decision; otherwise custom/CSS |
| Samsung One UI | Samsung official design guidance | Search and reference-led custom fallback |
| Windows Phone / Metro | Historical Microsoft design guidance | Reference-led custom; no default kit assumed |
| Xbox | Official Xbox design language and game UI references; search `Xbox UI kit` | Custom inline SVG/HTML/CSS when no verified kit |
| PlayStation 5 / PlayStation 4 | Official console UI references; search `PlayStation UI kit` | Custom inline SVG/HTML/CSS when no verified kit |
| PlayStation 1 / retro PlayStation | `PSone.css` and PS1 visual references | CSS candidate with strict asset/accessibility verification |
| SteamOS / Steam Deck | Official Steam Deck UI references; search `Steam Deck CSS UI` | Custom fallback unless a verified library appears |
| Nintendo Switch | Official UI references; search `Nintendo Switch UI kit` | Custom fallback; do not copy proprietary artwork |
| Y2K / Web 1.0 / Web 2.0 | Era-specific typography, layout, and chrome references; search the named era + `CSS framework` | Reference-led custom with original assets |
| Classic terminal / CLI | `WebTUI`; terminal typography and cursor studies | CSS-only or custom inline SVG |
| DOS | `BOOTSTRA.386`; DOS visual references | Prefer custom no-JS; theme candidate only after runtime review |
| CRT / phosphor terminal | CSS effects; terminal references | Custom CSS/SVG with motion and contrast review |
| Hacker / cyberpunk terminal | Original visual direction; no automatic library assumption | Custom semantic HTML/CSS |
| TUI / IDE / code editor | `WebTUI`; IDE interface references | CSS-only or custom; preserve HTML controls |
| Retro computing / 8-bit / 16-bit games | NES.css, System.css, 98.css, PSone.css; historical references | Pick one coherent language; avoid mixing unrelated eras |
| Web browser chrome | Browser UI references; original controls | Custom HTML/CSS/inline SVG; do not copy browser assets without rights |
| Smart TV | TV platform guidance and remote-navigation references | Custom static rendering with conservative focus and sizing |
| Wearables / watchOS / Wear OS | Apple HIG and Wear OS guidance for the relevant visual language | Custom compact static rendering; native behavior is not implied |
| Automotive dashboards | Official automotive HMI guidance; search exact vehicle or system + `UI kit` | Custom static rendering after safety and asset-rights review |
| Kiosk and POS systems | Industry HMI references; search exact kiosk/POS context + `UI kit` | Custom static rendering or a vetted CSS-only kit |
| E-reader interfaces | Device UI references; search `e-reader UI kit` | Custom static rendering with typography and reading-comfort review |
| Industrial and SCADA dashboards | Industry design references; search `SCADA dashboard UI kit` | Custom static rendering with domain review and semantics |
| Audio equipment / media players | Product UI references; search exact device aesthetic | Custom static rendering; do not copy proprietary assets |

## Platform-like visual rules

- Do not convert a visual language into a claim of production or native implementation.
- Prefer one coherent language per prototype. If the approved design intentionally combines languages, record the reason and boundaries.
- If a library is absent or weak, state that clearly and use semantic HTML/CSS with inline SVG for the static visual gaps.
- For Xbox, PlayStation 5 or PlayStation 4, Steam Deck, Nintendo Switch, and similar proprietary systems, assume a custom reconstruction until an official, legally usable, technically compatible kit is verified.
- Keep platform logos, screenshots, fonts, icons, sounds, and artwork out of copied assets unless the user can document permission.
