# Reye Design System

**Reye** (数字信任研究之眼 / *Digital Trust Research Eye*) is a bilingual (English / 简体中文) static web feed that tracks and analyses papers, blog posts, and news in the security and trust research space — AI safety, system safety, cryptography, and digital identity. The brand mark is a 🔭 telescope emoji. The aesthetic is dark glassmorphism inspired by iOS 17: blurred translucent cards, ambient gradient orbs, very rounded corners, system-stack typography.

Reye is a small but distinctive product — five domain hubs, ~110 article detail pages, plus search / insights / about pages. It is best understood as a **reading product** first and a **dashboard** second.

## Sources

- **GitHub:** [Linc-srch/reye-site](https://github.com/Linc-srch/reye-site) — the entire static site (main branch). Imported files live under `source_repo/` in this project: `index.html`, `about.html`, `insights.html`, `search.html`, three sample article pages, plus `style.css` (the canonical visual definition) and `app.js`.
- No Figma file was provided. No additional codebases were provided.
- Explore the GitHub repo further if you need an article page layout that isn't already covered here, or to confirm a token value before applying it in production.

## Index

| Path | Purpose |
| --- | --- |
| `README.md` | This file — product context, content & visual foundations, iconography. |
| `colors_and_type.css` | Canonical CSS variables: color, type, radius, shadow, spacing, motion. Plus `.glass-card` and `.t-*` semantic helpers. |
| `SKILL.md` | Agent Skill manifest — describes this folder as a reusable skill. |
| `assets/` | `logo-lockup.svg`, `logo-mini.svg`, `bg-ambient.svg`, `favicon.svg`. |
| `preview/` | 22 design-system tab preview cards (one per token group, one per component). |
| `ui_kits/web/` | High-fidelity recreation of the Reye web product, Apple-marketing flavour. Open `ui_kits/web/index.html` to interact. Includes a Tweaks panel for hero / motion variations. |
| `source_repo/` | The imported files from `Linc-srch/reye-site`, kept verbatim for reference. |

---

## Content Fundamentals

Reye is a **research feed for a single researcher**. It is not a marketing site. Copy is dense, factual, and assumes the reader can parse academic language. Two voices coexist:

- **Site chrome** (nav, hero stats, About) — terse, second-person-omitted, declarative.
- **Article summaries & Deep Notes** — full academic prose, structured under a fixed CRGP schema (Context / Related work / Gap / Proposal).

### Tone & voice

- **No marketing copy.** Headlines describe what something *is*, not why you should care. "About this feed", not "Discover cutting-edge research".
- **No "we" or "you" in chrome.** Voiceless: "Updated 2026-05-21 · 107 articles analysed · 111 total tracked". The site speaks like a status line, not a brand.
- **Quantities are first-class.** Counts, sparsity %, speedups, dates, all appear inline and bolded: "75% sparsity", "3.36× speedup", "1 today". Numbers carry more weight than adjectives.
- **Bilingual symmetry.** Every visible string has both an EN and a 中 version, toggled via header buttons. Chinese is not a translation — both feel native: short, technical, no exclamation marks.

### Casing & punctuation

- **Title Case for nav and short labels** ("Search", "Insights", "About", "AI Safety", "Cryptography", "Digital Identity & Trust").
- **Sentence case for prose** (article titles preserve the author's original casing).
- **Middle dot `·`** as a separator in meta lines: `Yuxiang Huang, ... · 2026-05-19 · arxiv`. Never a slash or a pipe.
- **Em-arrow `→`** for "go to original" links: `Original source →`.
- **Breadcrumb chevron `›`** between segments, dim grey.

### Examples (verbatim from the source)

> 🔭 Reye · 数字信任研究之眼

> Updated **2026-05-21** · **107** articles analysed · **111** total tracked

> About this feed / 关于此订阅
> Large language models, reinforcement learning, agentic AI, AI system security, Sandboxing, cryptography, post-quantum cryptography, digital identity, 3gpp, AI Safety, Deepfakes, prompt injections, jailbreaking

> No insights generated yet. The idea generator runs every Sunday at 09:30.

> Search titles, summaries, tags… *(input placeholder)*

### Emoji & vibe

- **One emoji, used once:** 🔭 (telescope) — the brand mark, paired with "Reye" wordmark in every header. **Never elsewhere.** No 🚀, 🎉, ✅ in body copy or summaries.
- **Vibe:** night-mode researcher, working late, glance-able. Calm, not loud. Information-dense but never crowded — cards have generous padding and float over a near-black background.

---

## Visual Foundations

### Colors

Background is **near-black with a blue tint** (`#070710`), never pure `#000`. Surfaces are **translucent glass** that sits *over* two large ambient gradient orbs (one blue, one violet) fixed to the viewport. Text is **near-white slightly cool** (`#e8e8f0`), dimmed copy is a **cool grey** (`#8888a0`). The single accent is a **soft blue** (`#6d9eff`) used for links, counts, and active state. A **violet** (`#b47eff`) appears only inside the ambient orb gradient — it never lands directly on text or controls.

There is **no light mode**. There is **no semantic color system in production** — `success`/`warning`/`danger` tokens have been added in this design system as natural extensions of the palette but the source repo doesn't use them.

### Typography

- **Sans:** Apple system stack — `-apple-system, "SF Pro Display", "SF Pro Text", system-ui, "Noto Sans SC", "PingFang SC", sans-serif`. CJK falls back to Noto Sans SC / PingFang SC.
- **Mono:** `"SF Mono", "Fira Code", ui-monospace, "Cascadia Code", "Menlo", monospace` — used only for inline `code` and `<pre>` blocks.
- **No display face.** No serif. No display-only weight stunts. The product looks at home next to macOS / iOS UIs because it borrows their typeface.
- **Tracking:** slight negative tracking on display sizes (`-0.02em` on h2, `-0.01em` on h1) — a signature SF-style detail.
- **Eyebrows** (`<h3>` in article body) are **uppercase**, very small (`0.78rem`), wide-tracked (`0.09em`), dim grey. They visually separate "Summary", "Deep Note", "Methods", etc.

> ⚠ **Font substitution flag.** Reye relies on the OS-bundled SF Pro / SF Mono — there are no webfont files in the repo. On non-Apple devices the stack falls through to `system-ui` (Segoe UI on Windows, Roboto on Android). For pixel-perfect mocks on Windows or in screenshots, install SF Pro from Apple or substitute Inter. **No webfont was added to `fonts/`** because the source has none. Tell the user if you need it.

### Spacing

The repo uses `rem`-based spacing with a base of `16px`. The grid is loose — there's no rigid 8-pt system. Card padding is `1.4rem 1.6rem` (≈ 22 × 26 px). Cards stack with `1rem` gutter; the domain grid uses `0.9rem`. Inline gaps in nav are `0.6rem`. Body padding maxes at `1.5rem` on desktop, `0.9rem` on small screens.

### Backgrounds

- **Two fixed ambient orbs**, drawn as `body::before` and `body::after`:
  - Top-right, 600 × 600 px, blue radial gradient (`rgba(80,110,255,0.15)` → transparent at 68 %).
  - Bottom-left, 500 × 500 px, violet radial gradient (`rgba(160,90,255,0.11)` → transparent at 65 %).
- Page background is solid `#070710`. The orbs provide the *only* color in the page chrome — everything else is glass on top.
- **No full-bleed photography. No illustrations. No patterns. No textures.** The aesthetic is intentionally clean.

### Animation

- **Tiny vocabulary**, all easing on the same curve (`cubic-bezier(0.2, 0.8, 0.2, 1)` is a sensible match for the default `ease` the repo uses).
- Hover transitions are `0.15s` for nav links and `0.2s` for cards.
- **No entrance animations**, no fades, no bounces, no spring physics. Pages just appear.
- The one motion flourish: **domain cards lift `translateY(-3px)` on hover**. That's it.

### Hover & press states

- **Nav links:** text dim → bright, background transparent → `rgba(255,255,255,0.07)`, pill rounding.
- **Cards (glass-card):** shadow deepens, border lightens from `rgba(255,255,255,0.09)` to `rgba(255,255,255,0.20)`. A second `inset` 1px white-ish ring appears on hover (encoded in `--shadow-card-hover`).
- **Domain cards:** lift 3 px in addition to the above.
- **Lang toggle / tabs (active):** solid `--color-accent` fill, white text, border same color.
- **Press states are not styled.** Default browser feedback only — no shrink, no color flash.

### Borders & strokes

- All borders are **hairline white at very low alpha** — `rgba(255,255,255,0.09)` resting, `0.20)` on hover. Never a solid color border on a card except for the accent-on-active toggle.
- Tag pills use a **tinted accent border**: `rgba(110,158,255,0.28)`.

### Shadows & elevation

Two-level system:

1. `--shadow-card` — `0 8px 32px rgba(0,0,0,0.55)`. Default for every glass card.
2. `--shadow-card-hover` — `0 16px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)`. A deeper drop *plus* a faint inner ring to suggest the card has been picked up.

**No inner shadows. No protection gradients.** Translucent capsules instead — that's the brand's hallmark.

### Transparency & blur

- **Every surface is translucent.** Cards are `rgba(22,22,35,0.62)` over `backdrop-filter: blur(24px)`. Header is the same. Input fields are `rgba(255,255,255,0.05)`.
- Blur radius is constant — `24px` everywhere. Reye doesn't use blur as a hierarchy device.

### Corner radii

- **`18px` for cards and the header** (large, generous).
- **`12px` for the search input** and other smaller surfaces.
- **`999px` (pill)** for nav buttons, lang toggle, tags, tabs.
- **`6px` for inline code**.

Reye is a **two-radius brand**: pill or 18 px. Nothing in between except code blocks.

### Cards

A card in Reye looks like this:

> `background: rgba(22,22,35,0.62); border: 1px solid rgba(255,255,255,0.09); border-radius: 18px; padding: 1.4rem 1.6rem; backdrop-filter: blur(24px); box-shadow: 0 8px 32px rgba(0,0,0,0.55);`

The shape is wide, never tall-thin. Content is left-aligned. The only centred card on the site is the hero stats strip on the homepage — it carries the soft blue→violet gradient overlay.

### Layout rules

- **Content max-width:** `1080px`, body `margin: 0 auto`. The product never goes full-bleed.
- **Sticky header** at `top: 1rem`, z-index 100. Floats inside the viewport rather than sticking flush — a glass capsule with a 1 rem gap above it.
- **Domain grid** is `grid-template-columns: repeat(auto-fit, minmax(230px, 1fr))` — adapts 2-up to 5-up by viewport.
- **Responsive:** below 640 px, header de-stickies, body padding shrinks to `0.9rem`, domain grid collapses to 2 columns. Below 420 px, 1 column.

### Don'ts

- Don't introduce a serif. Don't introduce a display font. Don't add an emoji other than 🔭. Don't use pure black. Don't add a card with sharp corners. Don't add a solid-color border. Don't add a drop shadow without the matching translucent background — opaque cards with shadow look wrong in this system.

---

## Iconography

**Reye does not have an icon set.** This is a deliberate choice. The product uses **language and typography to do the work icons usually do**, plus a single emoji and one Unicode character as accents.

### What the source actually uses

- **🔭 (telescope emoji)** — the **brand mark**. Appears once per page, in the header, immediately before the wordmark "Reye". Never anywhere else.
- **`›` (single right-pointing angle quotation mark, U+203A)** — breadcrumb separator. Wrapped in a `<span>` with a fixed `0.4rem` lateral margin and the dim text color.
- **`·` (middle dot, U+00B7)** — meta-line separator. Used inline in card meta and the hero stats strip.
- **`→` (rightwards arrow, U+2192)** — used in "Original source →" outbound links. Always trailing, never leading.

There are **no SVG icons**, **no icon font**, **no PNG icons** in the source. Search, nav and About all rely on **plain text labels** in their respective buttons.

### When you need an icon (extension guidance)

When extending the system — e.g. building UI kit pieces or slide layouts — keep iconography optional. If you must add a glyph:

1. **First** look for a Unicode character that does the job (›, →, ·, ·, ⌘, ⏎, ↩).
2. **If you need a true icon**, use [Lucide](https://lucide.dev) at `stroke-width: 1.5`, `size: 16–18px`, set its color to `var(--color-fg-2)` resting and `var(--color-fg-1)` on hover. Lucide's minimal stroke-only style matches Reye's restraint. **Flag the substitution to the user** — the source repo does not ship any icon library.
3. **Never** mix icon sets. Never add a filled / multi-color icon. Never use emoji as an icon — the telescope is the only emoji on the site.

This design system does not bundle a Lucide copy; load it from `https://unpkg.com/lucide@latest` when needed.

---

## Caveats & substitutions made

- **SF Pro / SF Mono** are not bundled (Apple does not allow redistribution). On non-Apple platforms the stack falls through to system defaults. If pixel-perfect renderings are needed, install SF Pro locally or substitute Inter (sans) and JetBrains Mono (mono).
- **No Figma** was provided — all design decisions are read directly from `source_repo/style.css`. If a Figma file exists, please attach it and I'll cross-reference.
- **Semantic colors** (success / warning / danger) are extensions — the production site doesn't render any. Use sparingly.
- **🔭 emoji** as a brand mark renders slightly differently on each OS. For a stable wordmark in marketing materials, request a vector telescope from the brand owner.
