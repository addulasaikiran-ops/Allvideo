# Allvideo — Agent Instructions

## Mission
Build a premium-quality, mobile-first 2.5D romantic story-platformer for the web. The girlfriend is the playable hero; her boyfriend is trapped in inner worlds shaped by overwhelm, loneliness, burnout, self-doubt, and fear. The hero helps him through love, patience, light, and understanding. The final boss is comforted rather than killed, and the ending is warm, personal, and happy.

## Chapter 1 — Story, world, and emotional safety
- Treat emotional care as a core mechanic, not just dialogue.
- Build five distinct inner worlds: overwhelm, loneliness, burnout, self-doubt, and fear.
- Avoid framing the boyfriend as an enemy to defeat. Resolve the finale through connection and comfort.
- Never use failure to shame or punish the player.

## Chapter 2 — Engine and gameplay
- Use Node.js 20+, npm, Vite, and JavaScript ES2022 modules.
- Use Three.js for 2.5D rendering.
- Keep `src/engine/` framework-independent plain JavaScript. Do not import React into the engine.
- The engine owns simulation, input, movement, collision, checkpoints, respawn, world state, and the game loop.
- Death triggers an immediate, gentle respawn at the latest checkpoint. Never remove lives, score, or collected progress as punishment.
- The game loop must never wait for React or UI rendering.

## Chapter 3 — Art direction and technical art
- Aim for polished 2.5D depth, readable silhouettes, atmospheric lighting, layered parallax, and coherent world-specific palettes.
- Do not imply placeholder art, music, or sound is production-ready.
- For every missing real asset, use a clearly named placeholder and document the need plus a license-safe source in `docs/ASSET_TODO.md`.
- Do not add unlicensed, scraped, or private assets.

## Chapter 4 — UI, UX, and accessibility
- React 18 in `src/ui/` renders all interface elements over the canvas: menus, HUD, dialogue, settings, pause, and end screens.
- React reads engine state through a store; it must not own or run the simulation.
- Never update React at 60 FPS. Publish state changes at a UI-appropriate cadence and use subscriptions/selectors.
- Use semantic HTML5, CSS3 custom properties, and CSS Modules.
- Support keyboard, gamepad, touch, landscape phones, desktop, reduced motion, high contrast, adjustable text size, colorblind-safe cues, and assist mode.
- All controls must have clear focus states, labels, and accessible names.

## Chapter 5 — Personalization and narrative content
- Keep all names, dates, photos, and personal messages in the single editable file `src/story/personal.config.js`.
- Load personal photos from `/public/personal/` (served from `/personal/` at runtime).
- Do not commit real private information or photos unless the project owner explicitly adds them.
- Provide safe neutral defaults and tolerate missing photos without breaking the game.

## Chapter 6 — Performance and quality
- Target 60 FPS on mid-range phones.
- Include an automatic quality scaler and make quality decisions observable/debuggable.
- Avoid per-frame allocations, dispose Three.js resources, cap device pixel ratio when appropriate, and respect reduced-motion preferences.
- Keep controls responsive and ensure the game loop is independent from UI updates.

## Chapter 7 — Verification and deployment
- Deploy to Vercel using Vite with `base: "/"`.
- Add `vercel.json` with SPA fallback and long-cache headers for hashed build assets; do not apply immutable caching to the HTML entry point.
- After each implementation step, run lint, tests, and production build; report exact commands and outcomes. Do not claim a check passed unless it was actually run.
- Keep changes small and reviewable on branches named `step-XX-name`.
- Audit before implementation, propose a plan, and wait for explicit approval before beginning a step.
- Ask the owner before adding any dependency. The owner has specified the required stack, but that does not waive this approval rule.
- Summarize changes and explain how to test them after each step.

## Chapter 8 — Repository hygiene and collaboration
- Keep engine, UI, story configuration, assets, and optional serverless functions separated. Optional Vercel functions live under `/api`.
- Keep architecture notes and asset requirements in `docs/`.
- Never store secrets in source control. Document required environment variables without including values.
- Prefer readable, typed-by-contract JavaScript and explicit module boundaries over hidden coupling.
- Do not silently broaden scope or replace required technologies.
- Before committing, inspect the diff and verify that no personal data, secrets, or unlicensed assets were introduced.

## Planned layout
```text
src/
  engine/       # Framework-independent plain JavaScript simulation
  ui/           # React UI rendered over the Three.js canvas
  story/        # Single personal configuration and story data
public/
  personal/     # Owner-provided personal photos only
docs/
  ASSET_TODO.md
api/            # Optional Vercel serverless functions
```
