# DESIGN-DECISIONS — provisional, for the owner's review

Everything below is a **reversible working choice** for the preview branch. Nothing here is an approved
final design. Items marked **OPEN** are explicitly the owner's call.

## 1. References — what transfers, and what must not be copied

| Reference | Transferable principle | Kept distinct by |
| --- | --- | --- |
| baothiento.com | Structural: identity, then work, then a personal tail; projects as editorial objects with role/medium lines | Different grid, type, colour; no reuse of its hierarchy or motion |
| rauno.me, /craft | Interaction detail as evidence; small live demos next to prose | Only one inline interactive is tested (Study C's spring); craft is shown through the real products instead |
| matthewyu.dev | Restraint; type and spacing carry the page | Not reproduced; our masthead and atmosphere are specific to this site |
| maggieappleton.com | Separating finished work from notes/experiments | "Playground" is labelled as experiments; Work lists only things that can be tried or read |
| joshwcomeau.com | Explanations that teach through interaction | Case studies keep their explainers; no whimsy layer added |
| steveruiz.me | An engineer's portfolio where the tool *is* the demo | Every project links to the live thing |

## 2. The three studies (`/design-studies/`)

All three use the same real content, the same portrait slot and the same media. They differ in
information architecture, composition and type.

| | A · Editorial Index | B · Exhibition Catalogue | C · Field Notes |
| --- | --- | --- | --- |
| Type | Fraunces (variable, opsz 144 for display) + IBM Plex Sans + Plex Mono | Newsreader throughout + Plex Mono captions | Schibsted Grotesk + Plex Mono |
| First fold | Name dominates on an off-axis grid; framed portrait right; role + one sentence; margin index | Two-page spread: matted portrait (verso) and title/contents (recto) | Modules: portrait, headline, live spring, note, one featured film |
| Work | One statement project, then rows of sharply different thumbnail scale | Three chapters (Instruments / Materials / Products) with films, plates and numbered captions | Index rows that expand in place to media + links |
| Page length @1440 | ~6,100 px | ~9,900 px | ~5,800 px |

### Critique (from the captures in `docs/screenshots/studies/`)

**A — Editorial Index**
- Identity is readable in under two seconds: name, role, one concrete sentence. Strongest of the three.
- First project starts at ~1.0 screen on 1440×900 (the hero is ~800 px tall). Acceptable; a "Selected work ↓" affordance is added in the preview.
- The FrameFlow statement video is light UI on light grey: as the *first* project it reads weak and corporate. → Preview uses a framed, darker-matted treatment.
- Rows risk becoming a uniform list (five rows of the same grid). → Preview breaks them into a pair, a full-bleed dark Iris band and compact rows.
- At 390 px the email in the closing line overflowed by 17 px (fixed). The `Currently` row with a link wrapped into the label column (fixed).

**B — Exhibition Catalogue**
- Best media storytelling: the Edition oversize crop and the dark Iris stage give each medium its own environment.
- First project is ~1.1 screens down, and chapter openers (cobalt Roman numerals at ~180 px) add ~3,800 px; the page feels long for a portfolio scanned in 10 seconds.
- "Selected works" running line collided with the title ascenders at 1440 (fixed with a gap).
- Serif-only body tone is warm but reads less like an engineer's site.

**C — Field Notes**
- Most distinctive engineer signal (a real, tunable damped spring), but the first fold is the busiest; five modules compete.
- The drawn column grid reads as a technical template, i.e. close to the "fake laboratory" the brief warns against.
- Collapsed index hides media by default, so the page looks thin at a glance; good for `/work/`, not for the home.
- Phone: the hero atmosphere was clipped to the content box, showing a hard edge (fixed by making the module full-bleed).

### Ranking and provisional choice

1. **A** — chosen as the *provisional* implementation basis (clearest identity, easiest to maintain).
2. **B** — its media environments are adopted: dark stage for Iris/Orbit, oversize Edition crop, numbered captions.
3. **C** — its expanding index is adopted for `/work/` (all projects, organised by category).

The studies stay in the branch for comparison; none were deleted.

## 3. Tokens (provisional — `assets/css/tokens.css`)

| Token | Value | Contrast on paper `#F6F6F2` / on `#EDF0F4` |
| --- | --- | --- |
| `--ink` | `#161A22` | 16.09 / 15.25 |
| `--text` | `#313942` | 10.80 / 10.24 |
| `--meta` | `#5F6977` | 5.14 / 4.87 |
| `--cobalt` | `#2348C7` | 6.87 / 6.51 |
| (brief's `#677180`) | rejected for metadata | 4.56 / **4.32 — fails AA** on the secondary field |
| (brief's `#2352DF`) | not used for text | 5.80 / 5.49 |

Cobalt density: names in italic, active labels, links, section numerals. Never a filled background.

**OPEN:** final typeface pairing (Fraunces continuity vs. a sans masthead as in C); exact cobalt.

## 4. Background — sculpted light + contour field

`assets/js/atmosphere.js`. The field is an interference of damped circular waves (the family of
solutions behind Iris Resonance's wave equation) plus one broad swell. It is rendered **once per
size** on a 2D canvas: a low-resolution relief shading pass and contour lines traced by marching
squares, faded toward an anchor (the portrait) and masked at every edge. Pointer response is a
damped translation of the finished canvas (3 / 7 / 14 px), rAF only while settling; disabled for
`prefers-reduced-motion` and coarse pointers. No WebGL.

| Mode | Lines | Relief | Parallax | Verdict |
| --- | --- | --- | --- | --- |
| Whisper | fragments, α 0.12 | barely | 3 px | Too faint to justify its cost; disappears on most screens |
| **Balanced** | 14 levels, α 0.20, localized to the portrait | soft | 7 px | **Recommended**: visible, never behind body text |
| Sculptural | 20 levels, α 0.28 | visible | 14 px | Starts to compete with the name and the portrait |

Evidence: `docs/screenshots/studies/bg-{whisper,balanced,sculptural}.jpg`. First captures showed two
defects (fixed): the canvas was clipped by a global `canvas{max-width:100%}`, leaving a hard right
edge; relief shading read as a grey smudge. **OPEN:** whether contours appear only in the hero (current)
or also at section transitions.

## 5. Hero boundary (owner's halftone portrait)

- Slot: any element with `data-halftone-slot`, containing `[data-halftone-stage]` and a fallback `<img>`.
- `assets/js/hero-slot.js` calls `HalftoneCover.mount(stage, config)` **only if** `window.HalftoneCover`
  exists, then hides the fallback (`data-state="live"`). Errors keep the fallback and log.
- The engine and its clips are **not** in this branch. Integrating = add
  `<script src="/halftone/halftone-cover.js"></script>` before `hero-slot.js` once the owner merges
  `halftone/` with real footage.
- Fallback: `photo_main.png` (existing, authentic), greyscale, multiplied onto paper. It is low resolution
  (912×558), so it looks pixelated when framed large — acceptable as a fallback, not as the final hero.
- **OPEN:** portrait scale, crop and whether the name overlaps the frame (A overlaps only on phones).

## 6. Homepage composition (provisional)

| Chapter | Treatment | Why |
| --- | --- | --- |
| 1 Masthead | Study A: name at opsz 144 on an off-axis grid, italic cobalt surname, framed portrait slot, role + one concrete sentence, "Selected work ↓", margin index | Identity in under two seconds; one explicit route to the work |
| 2 Selected work | FrameFlow lead on an ink mat (16:9 film) → Hinge (7 cols, white space) + Edition (4 cols, crop to the dots, offset down) → Iris full-bleed dark stage with the three live links → Orbit and Filo as compact rows | Six projects with four different rhythms; each medium gets its environment; no card grid |
| 3 Currently | Labelled rows from `content/site.json` + one italic aside | Honest, editable in one place |
| 4 Playground | Five verbs (Pull, Pluck, Expose, Play, Mix) — text-first strip | Experiments read as experiments |
| 5 Deck | Acrylic instrument (see §8) with a plain-language control map beside it | Every control explained without hovering |
| 6 Art + Writing | Three photographs at their own ratio; four essays; footer with direct email | Personal close, not a wall of social buttons |

Order of the six is provisional: FrameFlow first because it has the strongest real footage and a
full case study. **OPEN:** final lineup and order; whether Iris belongs in Work or only Playground.

## 7. Navigation, cards, gallery

- **Navigation:** fine-line horizontal masthead (Study A/B treatment) on every page, `aria-current`
  underline in cobalt, Contact as a mailto in cobalt. Not sticky. Phone (<760 px): a "Menu" button opens a
  native modal `<dialog>` (focus contained, Escape closes, focus returns to the button — tested).
  Case studies keep their own section list as a sticky sub-bar. The "characterful anchored project
  index" alternative was tried as Study A's margin index and Study C's index; kept only as the
  homepage margin list. **OPEN:** sticky masthead; whether the margin index stays.
- **Cards:** none. Projects are editorial objects (title as a design element, statement, medium,
  role, text links). Hover = cobalt title + underline draw + 3 % media scale (≤220 ms); focus shows
  the same state plus the outline.
- **Work index:** Study C's expanding rows, grouped Product / Experimental / Professional. Statement is
  visible in the closed row; media and links open in place; "Open all"; `/work/#<id>` deep links open a row.
- **Art:** both treatments are built on `/art/`: (a) *Sequence* — five placements that repeat, frames at
  native ratio, generous pacing (default); (b) *Contact sheet* — equal frames on a dark sheet
  (`/art/?view=contact`). Both open a modal lightbox (arrows, Escape, focus returns to the frame,
  `#id` deep link). Chosen default: Sequence, because the film frames are all 3:2 and the sequence
  creates pacing the contact sheet cannot. **OPEN:** default view; the retired 3-D point-cloud viewer
  from the old `gallery.html` (could return as a Playground piece).
- `gallery.html` now redirects to `/art/` (meta refresh + JS, canonical to `/art/`).

## 8. DJ deck

Material: a clear-acrylic sheet (layered translucent gradients, inner edge line, four screw heads),
machined platters with a 60-tick calibration ring and a single index mark, faders with engraved scale
ticks. Cobalt only when live (deck ID, platter mark, Sync on). No glow, no neon.

Behaviour changes are listed at the top of `assets/js/dj.js`; DSP curves are the original ones. The
`~/Development/Personal/acrylic-deck` prototype (isometric SVG, worklet player, original synthesised
tracks) is a stronger long-term answer and would also solve the rights question. **OPEN:** replace
this deck with acrylic-deck at `/deck/`, or keep this one.

## 9. Copy

- Hero sentence and Work/Playground/Art ledes are mine, written from verified project facts —
  **review the wording**.
- About page body is the owner's existing text from the old About panel, unedited; experience rows
  are from the old Experience panel.
- Essays are migrated byte-for-byte in their text (checked by stripping tags before/after).
