# Asset inventory and TODO

This repository includes some licensed audio, synthesized sound fallbacks, and intentionally empty personal-photo slots. Do not present missing or empty media as finished content.

## Current audio inventory

| Asset | Purpose | Current state | Next step |
|---|---|---|---|
| `public/audio/music/cc0-cathedral-forest-loop.ogg` | Base soundtrack used by all eight chapters | **Broken: file is 0 bytes** | Restore the original CC0 file from the documented source or replace it with a reviewed, license-verified track. Confirm non-zero size and browser playback before release. |
| `public/audio/music/cc0-dark-shrine-loop.ogg` | Tension/boss music layer | Present (678,630 bytes) | Verify transitions and relative loudness on desktop and mobile. |
| `public/audio/sfx/kenney-*.ogg` | UI and movement effects | Present for the referenced Kenney clips | Keep attribution/license notes alongside the files. |
| `jump.ogg`, `warm-light.ogg`, `checkpoint.ogg`, `heartbeat.ogg` | Optional effect slots in the audio manifest | Not present | Synthesized fallbacks are available; add files only after license review and browser verification. |

Audio provenance and CC0 notes: [OPEN-GAME-ART-CC0-LICENSE.md](../public/audio/music/OPEN-GAME-ART-CC0-LICENSE.md) and [KENNEY-RPG-AUDIO-LICENSE.md](../public/audio/sfx/KENNEY-RPG-AUDIO-LICENSE.md).

## Visual and personal content

| Asset / location | Purpose | Current state | Next step |
|---|---|---|---|
| `public/assets/placeholders/` | Lightweight visual placeholders | Inspect each asset before release | Replace only when approved artwork is ready. |
| `public/personal/` | Owner-provided photos | Intentionally empty | Add only photos supplied with appropriate rights and consent. |
| `src/story/personal.config.js` | Names, dates, photos, and personal messages | Uses neutral fictional defaults | Review every value before gifting; never commit private content unintentionally. |

## Rules for future assets

- Verify creator, source URL, license, attribution requirements, and redistribution rights before adding media.
- Do not download an asset just because it appears in search results; inspect its individual license.
- Record source, creator, license, and attribution beside adopted third-party assets.
- Never commit real names, dates, messages, or photos unless the owner explicitly chooses to add them.
- Do not ship a zero-byte or silent file as finished music. If an asset is unavailable, label the limitation clearly and test the fallback.
