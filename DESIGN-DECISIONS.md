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
| Selected Work | FrameFlow wide (16:10) → Hinge + Edition equal pair (16:10) → Iris full-bleed dark band (16:9) with links to its three experiments → Orbit + Filo smaller pair (3:2). One sentence and text links per project. Whole media frame is a link (hidden from AT, the title link is the accessible one). | Hybrid Exhibition: four rhythms, not six cards. |
| Currently | Three rows: Studying, Research (two links), Making. Small heading at left. | Brief; quieter than the work above. |
| Playground | Three thumbnails on the home page, six on `/playground/`, each a still image linking to the live app. No live canvases. | Performance and honesty. |
| Art | “Art” / “Coming soon.” / “Photography / Murals / Digital”. Previous photo sequence and lightbox removed from the page; files kept in `assets/media/photos/`. | Brief: no gallery until the owner curates it. |
| DJ deck | Kept. Defaults are two loops synthesised by `scripts/make-deck-loops.mjs`; visitors can open their own files (decoded locally). The six commercial MP3s are no longer referenced but are still in the repo (owner decision). | Rights. |
| Work index | Products / Creative experiments / Research, team and technical. Rows with a thumbnail, one line, stack, links. Replaces the expand/collapse rows. | Scannable without interaction; nothing hidden. |
| Case studies | Existing FrameFlow/Filo/Iris content kept; titles became “Name” + one sentence. Hinge/Edition/Orbit pages added on the same template: hero film, overview, interaction, engineering + real code, evidence, limitations, links. | Brief §8. |

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
