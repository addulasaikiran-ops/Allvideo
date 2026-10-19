# Audio asset sourcing and license register

This register records real candidate sources for the Allvideo audio palette. Keep the source page and the license evidence with every downloaded asset. Do not commit an asset until its download and license are verified.

## Music candidate

- **Ambient Cinematic — AtlasAudio**: https://pixabay.com/music/ambient-ambient-cinematic-510518/
- Why it fits: Pixabay lists it as ambient / solo piano with peaceful and hopeful mood; 2:04 duration.
- License shown on the track page: Pixabay Content License. Review the current [Pixabay License Summary](https://pixabay.com/service/license-summary/) before use.
- Important caveat: the page labels the track **Content ID Registered**. Save the license certificate at download time and test the production workflow for automated claims before shipping. This is a single full mix, not synchronized base/tension/boss stems; do not pretend it can provide beat-locked adaptive stems without arranging/editing it.
- Suggested use: temporary approved reference track for the calm/ending mood only, after downloading it yourself and verifying the license certificate. It is not yet vendored in this repository.

More candidates to audition (license each track individually):
- [Pixabay ambient cinematic piano search](https://pixabay.com/music/search/cinematic%20piano%20ambient/)
- [Pixabay emotional ambient cinematic piano](https://pixabay.com/music/ambient-emotional-ambient-cinematic-piano-115913/)
- [Pixabay calm cinematic atmospheric piano](https://pixabay.com/music/modern-classical-calm-cinematic-atmospheric-piano-310274/)

## Sound effects — recommended first-party packs

These Kenney packs explicitly list Creative Commons CC0 on their official asset pages, which is suitable for commercial use without attribution. Keep the original archive and license/readme in the project asset provenance folder anyway.

- **UI Audio (50 files)** — button, switch and click cues: https://kenney.nl/assets/ui-audio
- **Interface Sounds (100 files)** — broader interface palette: https://kenney.nl/assets/interface-sounds
- **RPG Audio (50 files)** — foley / footsteps: https://kenney.nl/assets/rpg-audio
- **Impact Sounds (130 files)** — impacts and short foley: https://kenney.nl/assets/impact-sounds
- Kenney license FAQ: https://kenney.nl/support

Use the UI Audio pack for press/confirm/back candidates and audition the Interface Sounds pack for hover alternatives. Use RPG Audio for footstep/landing candidates, then map clips to moss/wood/stone/crystal by listening rather than assuming the filename matches the surface. The initial reviewed subset is now bundled under `public/audio/sfx/` and mapped in `src/audio/manifest.js`: two footstep clips, coin handling for collection, book open/close/flip for UI cues, and a door close for back. Remaining jump, land variations by surface, warm-light pulse, checkpoint, and heartbeat cues retain synthesized fallbacks until matching clips are reviewed.

## Other source options

- **Freesound**: https://freesound.org/ — check the individual file's license. Prefer CC0 or a license that explicitly permits commercial reuse and modifications. Do not assume all Freesound uploads share a license; record the creator, file URL, license name/URL, and download date.
- **itch.io asset packs**: https://itch.io/game-assets/tag-music and https://itch.io/game-assets/tag-sound-effects — each seller chooses terms. Read the exact pack license and check whether redistribution of raw files in a public repository is permitted before committing assets.
- **Epidemic Sound**: https://www.epidemicsound.com/ — subscription/license terms depend on product and use case. Confirm that the selected plan covers an interactive video game and redistribution/runtime embedding. A general creator/video license may not cover an interactive game; obtain written confirmation or a suitable game license before integrating.

## Required workflow before shipping

1. Download the original asset from its source page and save its license evidence (license file/certificate, URL, creator, download date, and any attribution text).
2. Confirm that the license covers this specific use: an interactive game, public web deployment, commercial use if applicable, edits/looping, and redistribution as part of the game bundle.
3. Put reviewed assets under `public/audio/music/` or `public/audio/sfx/`. Avoid hotlinking a provider's CDN at runtime.
4. Record provenance in this document or a companion CSV. Do not rename away attribution metadata until the source and license are recorded.
5. For adaptive music, commission or obtain separately licensed base/tension/boss stems with matching BPM, bar length, sample rate and musical start point. A single mixed song is not three independent stems. If only one mix is available, use it as one layer and keep procedural tension effects separate.
6. Normalize and test on phone speakers and headphones. Check loop points, loudness, dialogue ducking, mobile autoplay unlock, and that the final build contains only assets with verified rights.

## Current integration status

- [ ] Music candidate downloaded and license certificate saved
- [ ] Adaptive stems licensed/commissioned and synchronized
- [ ] Kenney UI Audio pack downloaded and reviewed
- [x] Selected Kenney RPG Audio clips reviewed and bundled in `public/audio/sfx/`
- [x] Bundled clips mapped in `src/audio/manifest.js`
- [ ] Browser/mobile playback and production licensing checked

**Bundled SFX provenance:** the selected OGG payloads are unmodified Kenney RPG Audio files, retrieved from a public GitHub mirror of the pack; the official Kenney page identifies the pack as CC0. See `public/audio/sfx/KENNEY-RPG-AUDIO-LICENSE.md`. Music binaries and synchronized adaptive stems are still not bundled; chapter music paths remain placeholders.
