# Asset inventory and TODO

This inventory reflects the latest branch contents visible through GitHub's contents API during the PR #23 re-check. A claimed upload is not treated as present unless the repository contents confirm it.

## Current audio inventory

| Asset | Purpose | Current state | Next step |
|---|---|---|---|
| `public/audio/music/cc0-cathedral-forest-loop.ogg` | Base soundtrack used by all eight chapters | **Still observed as 0 bytes** on `step-23-stability-fixes` (empty-blob SHA `e69e29bb2d1d6434b8b29ae775ad8c2e48c5391`) | Re-check that the actual OGG binary is committed to the PR branch. Restore the original CC0 file from the documented source or use a reviewed, license-verified track. Confirm non-zero size and browser playback before release. |
| `public/audio/music/cc0-dark-shrine-loop.ogg` | Tension/boss music layer | Previously inventoried as present (678,630 bytes); not re-measured in this re-check | Verify transitions and relative loudness on desktop and mobile. |
| `public/audio/sfx/kenney-*.ogg` | UI and movement effects | Previously inventoried as present for referenced Kenney clips; not re-measured in this re-check | Keep attribution/license notes alongside the files. |
| `jump.ogg`, `warm-light.ogg`, `checkpoint.ogg`, `heartbeat.ogg` | Optional effect slots in the audio manifest | Previously inventoried as not present; synthesized fallbacks were reported | Re-check current manifest and files. Add files only after license review and browser verification. |

Audio provenance and CC0 notes: [OPEN-GAME-ART-CC0-LICENSE.md](../public/audio/music/OPEN-GAME-ART-CC0-LICENSE.md) and [KENNEY-RPG-AUDIO-LICENSE.md](../public/audio/sfx/KENNEY-RPG-AUDIO-LICENSE.md).

## CI and lockfile status

The latest inspected PR workflow run was [Verify #416](https://github.com/addulasaikiran-ops/Allvideo/actions/runs/39254325160). It failed during `npm ci` because the checked-out PR merge commit did not contain a usable `package-lock.json`; lint, tests, asset verification, and build were skipped. Exact npm error excerpt:

```
npm error code EUSAGE
npm error The `npm ci` command can only install with an existing package-lock.json or
npm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or
npm error later to generate a package-lock.json file, then try again.
```

During this re-check, fetching `package-lock.json` from `step-23-stability-fixes` returned HTTP 404. Re-check the branch after the claimed commit appears on GitHub, then inspect the next CI run. Do not mark the lockfile or checks resolved based only on a local commit or a claim that it was pushed.

## Visual and personal content

| Asset / location | Purpose | Current state | Next step |
|---|---|---|---|
| `public/assets/placeholders/` | Lightweight visual placeholders | Previously inventoried; not re-audited in this check | Inspect each asset before release. Replace only when approved artwork is ready. |
| `public/personal/` | Owner-provided photos | Previously inventoried as intentionally empty; not re-audited in this check | Add only photos supplied with appropriate rights and consent. |
| `src/story/personal.config.js` | Names, dates, photos, and personal messages | Previously inventoried as using neutral fictional defaults; not re-audited in this check | Review every value before gifting; never commit private content unintentionally. |

## Rules for future assets

- Verify creator, source URL, license, attribution requirements, and redistribution rights before adding media.
- Do not download an asset just because it appears in search results; inspect its individual license.
- Record source, creator, license, and attribution beside adopted third-party assets.
- Never commit real names, dates, messages, or photos unless the owner explicitly chooses to add them.
- Do not ship a zero-byte or silent file as finished music. If an asset is unavailable, label the limitation clearly and test the fallback.
