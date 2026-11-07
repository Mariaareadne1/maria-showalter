# FACTS_TO_CONFIRM — owner review

Things the site states or implies that I could not verify from a source, plus decisions only you can make.

1. **Research wording.** Currently/About list the Formal Methods and Reasoning Group and the Computer Music Center as research affiliations with no role, project or title. Confirm this framing is accurate. (`https://www.cs.columbia.edu/~ms6147/` returned no readable text to a plain fetch, so the group name comes from your brief.)
2. **About text.** The two sentences are your brief’s default. The previous longer About (Cherokee/Greek heritage, pickleball club, COTY throughput figure) was removed from the page, not edited; it is in git history.
3. **Experience dates** (Audacity 2026–, Filo 2025–, Almaworks 2025–, ACC summer 2025, COTY summer 2024) are carried over from the old site’s Experience panel unchanged.
4. **“Class of 2028” / Hellenic Studies minor** no longer appear on the site; re-add if wanted.
5. **Commercial MP3s** (six tracks) are still committed in the repo root, unreferenced. Delete them from the branch or keep them out of a public merge?
6. **Film photos** in `assets/media/photos/` and the three B/W process shots stay in the repo but are not displayed. The Edition demo uses `img_0422` (sunset over water, no people) as its source photo: confirm you’re happy for it to appear in a project demo.
7. **Halftone portrait.** Integrating needs the engine (`halftone/halftone-cover.js`) and your clips committed on a branch; then add one script tag before `hero-slot.js`.
