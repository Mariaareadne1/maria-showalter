# Design decisions — V2 sky + editorial (2026-11-08)

## V2.2 — Sky jelly: a 3D slab on the sky (2026-11-08)
Owner feedback on V2.1: liked Sky glass's colour and white type and Soft jelly's texture, but none had enough depth — it should feel 3D, like a jelly object laid on top (references: a "liquid glass" UI kit, two glass weather cards).

What the references do that V2.1 did not, and what changed:
- **The rim is a lit, rounded surface.** The shader now builds a 3D normal from a circular edge profile (`bulge`) and lights it: diffuse relative to the flat top (`shade`), a tight gloss (`gloss`), fresnel at grazing angles, light gathered inside the lower rim (`caustic`), a lit lip and a contact line at the very edge. Lit top-left, a softer glass wall bottom-right.
- **Heavy lensing where the surface is steep** (`lens`): the sky smears and stretches through the edge, with stronger dispersion.
- **Seen through, not painted over.** For white ink, brightness behind text is now *compressed* smoothly into the readable range instead of clipped flat, so clouds behind stay visible as darker shapes in tinted glass. Rim lighting is applied after the contrast step and kept off the text column, so it can be bright.
- **A reflection on the top face** (`sheen`), fixed to the view so the slab slides beneath it.
- **Lifted off the sky:** contact, offset and ambient shadows, cool-tinted (CSS, `html[data-glass=skyjelly]`).
- **Pointer response** for white ink is shaded after the contrast step (shade free, highlights held back over text), so the dome and the press dent read without hurting legibility.
- Bevel scales with panel width (≤ 12 % of the half-width) so phones keep the edge clear of the text.

Two new treatments: **Sky jelly** (default now — Sky glass colour, jelly thickness, 3D rim) and **Clear jelly** (the same object nearly clear; shading and frost only in soft halos behind each run of text, positions sent to the shader each frame). Older four kept in the switcher for comparison. See docs/v2-review/glass-skyjelly-clearjelly.jpg, glass-skyjelly-frames.jpg, glass-jelly-demo.mp4.


## V2.1 — the panel as a glass object (2026-11-08)
Owner feedback: the panel read as "a frosted card over a sky"; make it a real material — thickness, refraction, luminous edges, varied frost, a quiet physical response — and try white type. The sky is the environment; the panel is the object.

- **How it is drawn:** a WebGL 2 pass (`sky/src/glass/`, built to `assets/sky/portfolio-glass.js`, ~9 kB gzip) in a panel-sized canvas behind the sheet's content. The live sky frame is copied into a mip-mapped texture (0.1–0.2 ms) and refracted: bevel lensing that pulls a compressed strip of the sky in from beyond the rim, slight dispersion, low-frequency waviness, frost that is clearer at the rim and densest over the text column with a soft hand-made unevenness, body tint, absorption along the lower rims, the slab's far edge seen through it, and a specular rim lit from the upper left. Inner pages refract the still (no renderer there).
- **Locked to the page while scrolling:** the canvas is `position: sticky` inside a wrapper clipped (`clip-path`) to the sheet, so the compositor keeps its edges on the sheet; only the sky seen through it uses (one frame older) layout, which blur hides. The 1 px rim highlight and the shadow are CSS for the same reason.
- **Four treatments, compared on screen** (`?glass-compare` adds a switcher; `?glass=<id>` picks one): **Clear lens** (thin, crisp, dark ink), **Soft jelly** (thick 46 px rounded bevel, milky, dark ink — *default*), **Smoked glass** (graphite, white ink), **Sky glass** (deep sky-blue, white ink). See docs/v2-review/glass-treatments-0.jpg and -1500.jpg (top / scrolled).
- **White type:** works on Smoked and Sky glass. Legibility is not left to luck: the shader enforces a per-pixel luminance ceiling behind the text column (white ink) or a floor (dark ink), pulling toward a deeper shade of the body tint so clouds passing behind darken into the glass colour instead of grey smudges. With white ink the panel deepens (not whitens) as you read. `--meta` darkened to #41474F so grey labels pass on frosted glass.
- **Jelly response (restrained):** springs, not keyframes. Near the rim the bevel widens toward the pointer (surface tension); over the slab a soft dome lifts, catches light and clears the frost a little; a press dents it and it springs back with one small overshoot (ζ 0.42); fast scrolling makes the surface trail a few px and settle. Off with reduced motion; touch gets press/release only.
- **Sky depth:** the veil is now an aerial-perspective haze (14 % overhead → 36 % at the horizon, plus the reading wash) instead of a flat 27 %; three clouds added at 12, 34 and 44 km — one crossing the panel's left rim (so the refraction has something to bend) and a far bank on the horizon.
- **Width:** 800 → 880 px (radius per treatment, 26–32 px). At 1440 px the sky margins are still 280 px a side.
- **Fallbacks:** no WebGL 2, reduced transparency, more contrast or forced colours → the CSS glass (backdrop blur, top glow, rim) or an opaque paper sheet, as before.

## Default for now
Soft jelly with dark ink, because it keeps the brief's off-white reading surface. Sky glass with white type is the most striking object; choosing it makes reading surfaces deep blue on every page. Owner's call — see REVIEW-NOTES.md.


## Direction
A small near-white publication floating on Sky Study's real sky. One narrow sheet (800 px max), black type, no accent colour; the sky and the project media supply all colour. No droplets, no forced sunset, no second 3D object.

## Choices made by looking at screenshots
- **Type:** Instrument Sans throughout (OFL, self-hosted), Plex Mono only for tiny data labels. Tried against PR #2's Fraunces + Plex: the serif display face fought the photographic clouds and read as the familiar "editorial AI" look; one sans next to the sky is calmer and makes **Design Engineer** unmistakable. Role 80 px / 500 / −0.045em.
- **Sheet:** 800 px, 22 px radius, `rgba(250,250,247, .66 → .97)` with 22 px blur, inner top highlight and a soft long shadow. Width and position never animate; only `--sky-p` (0→1, measured from the top of the page to *Currently*) changes background alpha and a veil over the sky. Phone: sheet 16 px from the edges, starts 38svh down so the sky opens the page.
- **Sky paleness:** the raw engine noon sky behind a page read slate-blue; a constant 27 % pale veil (rising to 63 % at *Currently*) gives the pale daylight asked for without touching the renderer.
- **Selected Work:** compact. FrameFlow lead at 16:9 across the column, then an even 2-column grid (16:10). Title, one line, quiet links. Filo now shows real dev-build screenshots instead of the diagram.
- **Playground:** four square tiles in one row on desktop (two on tablet, phone), visibly different from the work cards. Only worlds verified by drawing in them.
- **Also:** Art and DJ Deck as two plain "Coming soon" rows; `#deck` anchor kept for old links.
- **Edit sky:** a quiet pill with a tiny cloud glyph next to "Selected Work ↓"; a second corner pill appears only on wide screens once the hero button has scrolled away. Hover/focus hint "Draw and move clouds".

## Screenshot critique (final pass, 1440×900 and 390×844; images in docs/v2-review/)
1. Sky visible and beautiful, enough margin? Yes at 1280–1440 (240–320 px each side, clouds composed in the margins). At 1024 the margins are ~110 px: clouds are cut but still read. Phone opens on a band of sky with one cloud.
2. Panel narrower than before and readable at every width? 800 px vs PR #2's full-bleed 1520 px grid. Contrast of body text on the most transparent state stays above 12:1 (near-black on ≈#E3EAF0).
3. Design Engineer clear without repeated intro? One heading, one sentence; the wordmark is only in the masthead.
4. Glass refined, not a dashboard card? One surface, no nested glass, media sit directly on it.
5. Selected Work scannable in seconds? Five items, one rhythm, no hover-only information.
6. Playground reads as independent playable worlds? Yes: painted tiles, verbs that match what each does, no product duplicates.
7. Sky→off-white natural? A single continuous value; reversible; no width jump (tested).
8. Effects competing with content? The play/pause chips were restyled smaller; the corner Edit pill hides at the top and once the sky is veiled.
9. Coherent across pages? Same sheet, masthead, type and footer on Work, Playground, Art, Writing, About, case studies, essays, 404.
10. Substantially different from the previous site? Yes (before/after: docs/v2-review/before-after-*.jpg).

## Open for the owner
- Lead item size: FrameFlow at full column width is the largest thing on the page; an all-equal grid is a one-line change in `scripts/build-content.mjs`.
- Portrait: slot kept (hidden) — see REVIEW-NOTES.md.

---

# DESIGN-DECISIONS — Portfolio V1

The earlier exploration record (three studies, background modes, provisional tokens) is in git at
`a0204eb:DESIGN-DECISIONS.md`. This file records what V1 decided and why.

## Direction

Editorial studio, light paper, cobalt as a sparse accent. The interface stays quiet so project media can be loud.
Sky/hills background: deferred, not built. The hero keeps the existing contour atmosphere in its faintest
(“whisper”) mode, static under reduced motion.

## Decisions

| Area | Decision | Why |
| --- | --- | --- |
| Header | Only “Maria Showalter” (Plex Sans 500, 15 px) + Work · Playground · Art · Writing · About. Contact moved to footer. Sticky, thin rule, translucent paper. | Brief: name-only brand. Sticky costs ~50 px and keeps navigation one move away on long case studies. |
| Hero | `<h1>` reads “Design Engineer” at display size (Fraunces 330, opsz 144, roman, ink). Screen readers hear “Maria Showalter, Design Engineer”. One sentence, set right of centre over a rule. | Role first after the name; no repeated name; hierarchy from scale and position. |
| Portrait | Slot reserved (`data-halftone-slot`, `hidden`). It is shown only when `window.HalftoneCover` exists and mounts. The old `photo_main.png` fallback is no longer shown. | The engine and footage live only in the protected checkout; `media/` there is empty. The only static portrait is 912×558 and visibly pixelated at hero size. A typographic hero is better than a blurry one. |
| Emphasis | No italic, coloured or bold single words anywhere in headings or taglines. Old `.cs-title em` and `.page-head h1 em` neutralised. | Brief. |
| Type | Fraunces (display/headings) + IBM Plex Sans (UI/body) + Plex Mono only for small metadata labels. | Already loaded; two families + mono. |
| Selected Work | FrameFlow wide (16:10) → Hinge + Edition equal pair (16:10) → Orbit + Filo smaller pair (3:2). (An Iris series band was built and then removed at the owner’s request.) One sentence and text links per project. Whole media frame is a link (hidden from AT, the title link is the accessible one). | Hybrid Exhibition: three rhythms, not five identical cards. |
| Currently | Three rows: Studying, Research (two links), Making. Small heading at left. | Brief; quieter than the work above. |
| Playground | Three thumbnails on the home page (led by TONUS, so it doesn’t repeat Selected Work), five on `/playground/`, each a still image linking to the live app. No live canvases. | Performance and honesty. |
| Art | “Art” / “Coming soon.” / “Photography / Murals / Digital”. Previous photo sequence and lightbox removed from the page; files kept in `assets/media/photos/`. | Brief: no gallery until the owner curates it. |
| DJ deck | Kept. Defaults are two loops synthesised by `scripts/make-deck-loops.mjs`; visitors can open their own files (decoded locally). The six commercial MP3s are no longer referenced but are still in the repo (owner decision). | Rights. |
| Work index | Products / Creative experiments / Research, team and technical. Rows with a thumbnail, one line, stack, links. Replaces the expand/collapse rows. | Scannable without interaction; nothing hidden. |
| Case studies | Existing FrameFlow/Filo content kept; titles became “Name” + one sentence. Hinge/Edition/Orbit pages added on the same template: hero film, overview, interaction, engineering + real code, evidence, limitations, links. | Brief §8. |

## Copy, before → after

| Where | Before | After |
| --- | --- | --- |
| Header | Maria Showalter … Contact | Maria Showalter (Contact in footer) |
| Hero label | DESIGN ENGINEER · CREATIVE TECHNOLOGIST | Design Engineer (the headline) |
| Hero line | I build interactive software that behaves like material — springs you can tune, cloth you can play, prints that develop — and the tools that turn it into something people can use. | I design and build software, interactive tools, and digital experiments. |
| Name | Maria / *Showalter* (italic cobalt) | Not repeated in the hero |
| FrameFlow | Turns a raw macOS screen recording into a composed product film: clicks and pauses become editable camera Moments, and one renderer drives preview, MP4 and GIF. | Record your screen. Edit the camera movement. Export a finished video. |
| Orbit | Choreograph sounds around a listener on a top-down stage. Positions drive real HRTF panning, and the arrangement renders to a WAV that pans the way playback did. | Draw paths for sounds to move around your head. |
| Currently | Five rows (Studying … Committee) + italic aside about touch | Studying / Research (FoRG, CMC) / Making |
| Playground | Pull · A slime you can pull, poke and squish — a skin that accepts a stretch, then forgets it. | Soft Matter · Pull and squish a slime. |
| Work page | Instruments, products and *studies*. + a paragraph on how I work | Work · Products, creative experiments, and research and team work. |
| About | Five paragraphs, starting “I build at the intersection of software, systems, and…” | Two sentences (brief’s default) + Research, Experience, Contact lists |
| Footer | Say hello — m.showalter@columbia.edu | Name · email · GitHub · LinkedIn · YouTube · Back to top |
| FrameFlow title | From screen capture to a *considered* product film. | FrameFlow / Record your screen. Edit the camera movement. Export a finished video. |

The long technical explanations moved nowhere: they remain in the case studies (`detail` in `content/site.json` keeps the old statements for reference).

## Refinement passes

See QA-RESULTS.md §Visual passes for the screenshots and the concrete changes of each pass.
