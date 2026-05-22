---
name: reye-design
description: Use this skill to generate well-branded interfaces and assets for Reye (数字信任研究之眼 / "Digital Trust Research Eye"), either for production or throwaway prototypes / mocks / decks. Contains essential design guidelines, colours, type, ambient-orb backgrounds, brand lockups, and a React UI kit recreating the live Reye web product.
user-invocable: true
---

# reye-design

Read `README.md` first — it covers product context, content fundamentals, visual foundations, and iconography (which is intentionally minimal: 🔭 plus three Unicode characters, no SVG icon set).

Then explore as needed:

- `colors_and_type.css` — the single source of truth for tokens (colour, type, radius, shadow, spacing, motion). Includes ready-to-use `.glass-card` and `.t-*` semantic helpers.
- `assets/` — logo lockups (`logo-lockup.svg`, `logo-mini.svg`), ambient background (`bg-ambient.svg`), and a favicon. The brand mark is the 🔭 telescope emoji; the SVGs are convenience renders that embed it as a text glyph.
- `ui_kits/web/` — high-fidelity React recreation of the Reye web product (Apple-marketing flavour over the dark-glass aesthetic). Use these components as a starting point for mocks; load them as inline JSX via Babel as in `ui_kits/web/index.html`.
- `preview/` — small standalone HTML cards demonstrating individual tokens / components. Useful as reference snippets for HTML output.
- `source_repo/` — the upstream Linc-srch/reye-site files, kept verbatim. The canonical reference.

## When generating output

**Visual artifacts** (slides, mocks, throwaway prototypes, marketing pages): import `colors_and_type.css`, copy any needed `assets/`, lean on the `.glass-card` helper for surfaces, set the page background to `#070710`, and place at least one fixed ambient orb (`bg-ambient.svg` or the inline `body::before` / `body::after` pattern in `source_repo/style.css`) — without the orbs the design looks empty.

**Production code**: read the README's *Visual Foundations* and *Content Fundamentals* sections carefully. The brand has strict rules — two corner radii (18 / pill), no emoji other than 🔭, no serif, no icons unless absolutely needed, every visible string in both EN and 中.

## When invoked without guidance

Ask the user what they want to build or design. Some good questions: *Marketing landing page or product surface? Web, slides, or static export? EN-only or bilingual? Long-form reading view or dense dashboard? Should it lean closer to the source repo's compact style or the Apple-marketing flavour in `ui_kits/web/`?* Then act as an expert designer who outputs HTML artifacts or production code, depending on the need.

## Things to flag

- **SF Pro / SF Mono substitution**: the system stack falls through to OS defaults on Windows / Android. If pixel-perfect rendering is needed there, ask the user for SF Pro files (Apple-licensed) or substitute Inter / JetBrains Mono.
- **No icon library**: the source ships no SVG / icon font. If you need icons, use [Lucide](https://lucide.dev) at `stroke-width: 1.5`, sized 16–18 px, in `var(--color-fg-2)` — and flag the addition to the user.
- **Avoid** introducing serif faces, additional emoji, gradient backgrounds outside the ambient orbs, opaque cards, or sharp corners. Those break the brand.
