# Data-driven levels

Level files live in `src/levels/*.json`. Each file has `schemaVersion`, `id`, `title`, `targetPlaytimeMinutes`, `world`, `parallax`, and `entities`. Entity coordinates use world units: `x` is the left edge, `y` is the bottom edge, and platform collision height is `y + height`. Moving-platform paths use `axis`, `distance`, and `speed`.

Supported entity types:

- `static-platform`, `moving-platform`, `crumbling-platform`, `one-way-platform`
- `switch` and `door` (connect a door with `requiresSwitch`)
- `spring`, `wind-zone`, `hazard` (`thorns` or `dark-mist`)
- `checkpoint`, `collectible` (`heart` or `memory-fragment`), `enemy-spawner`
- `cutscene-trigger`, `camera-zone`, and `hint`

The level manager is renderer-agnostic. It exposes collision platforms to the existing physics controller, emits typed events for game systems, tracks switches/collections/checkpoints, and produces a serializable snapshot for renderers and debug tools. The scene renderer draws entity previews and optional collider wireframes. F3 toggles level diagnostics (including FPS and checkpoint ID); F5 reloads the current JSON level. F2 remains the player-feel tuning panel.

## Chapter 1 — The Quiet Morning

Target: 4–6 minutes, with no text-wall tutorial. Environmental prompts are short and contextual; each fades once the related action succeeds.

1. **Move:** a wide, safe meadow and grass movement cues.
2. **Jump:** a small, forgiving gap with a heart on the landing platform. Missing the first obstacle only returns the heroine to a checkpoint; it cannot kill her.
3. **Double jump:** a higher ledge and a visible memory spark imply a second jump.
4. **Pulse:** a soft dark-mist pocket frames a memory fragment, teaching Warm Light through cause and effect.
5. **Interact:** a small bell switch opens the morning door. A spring, moving ledge, crumble ledge and one-way ledge add optional traversal texture on the way out.

The first obstacle is non-lethal and hazards in this chapter are safe-fail by default. The level JSON intentionally keeps the enemy spawner inactive during this tutorial; its entity type is available for later chapters.


## Chapter 2 — Tangle of Worries

Target: 6–8 minutes. Palette: midnight blue, muted sage, amber/teal/rose knot cores, and drifting firefly particles. The flow curve is **introduce → practice → twist → test** across four spatial sections. Thorn knots accept Warm Light pulses only in their numbered order. If the player remains near the next knot for 20 seconds, it gives a visual strand-color cue and a soft lantern-chime cue; an incorrect knot gently reminds the player which strand is next. Worry wisps orbit, are harmless on contact, and calm for five seconds when pulsed rather than dying. Checkpoints at the opening, practice/twist boundary, and final test are spaced to target roughly 30–45 seconds of traversal.

## Chapter 3 — Sea of Distance

Target: 6–8 minutes. Palette: deep ocean blue, sea-glass teal, and pale aqua light, with sea-glint ambient particles. The four-part flow curve introduces island hops, practices nearby-heart light bridges and slow tide lifts, twists with gentle spark-wisp shots, then tests the combined traversal language. Light bridges remain dormant until the configured number of collected hearts are within their radius. Tide platforms move vertically at readable, low speeds. The message-in-a-bottle dialogue is explicitly skippable. Checkpoints at the first outer island, middle sea, and far-shore approach aim for 30–45 second intervals.

Chapter selection is available in the game overlay. F3 continues to show level diagnostics and F5 reloads the currently selected chapter JSON. The chapters expose typed events (`knot:untangled`, `enemy:calmed`, `enemy:projectile`, `bridge:formed`, and `dialogue:trigger`) for future audio, UI, and effects polish.
