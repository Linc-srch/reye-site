# Reye Web — UI Kit

A high-fidelity recreation of the **Reye** static web product (the GitHub source at [Linc-srch/reye-site](https://github.com/Linc-srch/reye-site)), pushed slightly in an Apple-marketing direction: bigger display type, more whitespace, scroll-driven fades, parallax orbs, gradient-tinted headlines. The colours and surface vocabulary are identical to the source — only the *scale* and *motion* are dialled up.

Open `index.html` and click around: nav, language toggle, domain cards, the featured article, search, the About panel, an article detail. All interactions are real (in-memory).

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page shell — loads React (UMD), Babel, and the JSX components below in order. |
| `styles.css` | All UI-kit styling. Imports `../../colors_and_type.css` for tokens. |
| `Header.jsx` | Sticky floating glass nav capsule with bilingual brand + EN/中 toggle. |
| `Hero.jsx` | Apple-marketing-flavor hero: massive 3-line display, gradient-tinted tail, lede, dual CTA, 4 KPIs, scroll cue, parallax orbs. |
| `DomainGrid.jsx` | The 5-domain grid. Big accent numerals, hover lift, blue glow on hover. |
| `FeaturedFeed.jsx` | "This week" section: one hero featured card + a 2-column list of recent analyses. Holds the in-memory `ARTICLES` data. |
| `SearchPane.jsx` | Live filter over `ARTICLES`. Glass input with leading magnifier, trailing clear. |
| `ArticleDetail.jsx` | Long-form reading view following the source's CRGP schema (Context / Related / Gap / Proposal) plus Experiments / Why-it-matters / Next-steps. |
| `AboutPane.jsx` | The About + Footer block. |
| `App.jsx` | Top-level router (home / search / insights / about / article-detail). Owns the `useScrollFadeUp` hook driving in-view fade-ups via `IntersectionObserver`. |

## Notes on departures from the source

These are **intentional upgrades** in the spirit of "Apple-elegant, futuristic, interactive":

- The header is a **pill capsule** floating at the top, not the rounded rectangle the source uses.
- The hero is a **full-viewport tall, centred** marketing moment with display type at `clamp(56px, 9vw, 132px)`. The source has no hero at all — it's a stats strip + a domain grid.
- A **blue→violet linear-gradient text fill** lands on the last line of the hero h1 and on the eyebrow phrase of each section. The source uses *no* gradient text anywhere.
- A **featured card** carries the source's `.hero-stats` blue→violet wash and now wraps a *paper*, not a stats line.
- **Domain cards** are bigger (count is `64px` here, `2.2rem ≈ 35px` in source) and animate a faint blue glow on hover.
- **Section headings** use `clamp(38px, 5vw, 64px)` — the source has no equivalent visual scale.
- **Scroll-driven fade-ups** are added throughout. The source has zero motion beyond a 3-px hover lift on domain cards.

If you want a strict, source-faithful recreation instead, the source `style.css` is preserved verbatim at `../../source_repo/style.css` — you can rebuild against it.

## How interactions work

- **Nav / lang toggle** lives in `Header.jsx`. Lang persists to `localStorage` under `reye-lang`.
- **Domain cards** route to the search pane (the source routes to per-domain index pages — these aren't recreated in this kit yet).
- **Featured card and feed items** open the `ArticleDetail` view. Use the "← All articles" back link to return.
- **Search** filters the in-memory `ARTICLES` array across title / summary / authors / source / tags in both languages.
- **Insights** is intentionally a "Sundays at 09:30" placeholder, matching the empty state in the source.

## Known gaps vs the production source

- **Per-domain index pages** (`/domains/ai_safety/`, etc.) aren't recreated. Clicks route to Search instead.
- **arXiv source link** is non-functional — clicking does nothing rather than opening a new tab.
- **Per-article Chinese deep-note** is a hard-coded sample on the DashAttention paper; other papers reuse the same body copy.
