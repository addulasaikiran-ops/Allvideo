# Companion states, voice echoes, and Connection HUD

The companion is designed as a person with his own presence, not a quest objective or a problem the heroine must solve.

## Story data
- `src/story/personal.config.js` exports `COMPANION_STATES` and `COMPANION_PRESENCE`.
- `COMPANION_STATES[chapterId]` selects his silhouette state, label, and short text echoes. The `default` entry is the fallback.
- `COMPANION_PRESENCE[chapterId]` selects the environmental cue (scarf, distant lantern, ribbon, reflection, flower).
- `src/ui/CompanionPresence.jsx` renders those entries. Edit the story config to personalize dialogue without changing UI code.
- The Connection meter uses the current game-store heart count (10 percentage points per heart, capped at 100); it is progress feedback, not a relationship-health judgment.
- Text echoes are the accessible, quiet default; no audio permission is needed.

## States and co-op
Each chapter can select `curled-up`, `looking-away`, `tired`, `hopeful`, or `smiling`. The CSS silhouettes use restrained poses and breathing, with reduced-motion support. Hold hands appears only in Chapters 6 and 8; the tether is a forgiving visual interaction, can be released any time, and never gates progression or collectibles.

Keep dialogue short and non-coercive. His feelings are not puzzles for the player to repair, and his presence should not be framed as a burden.
