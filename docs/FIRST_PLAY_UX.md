# First-play UX pass

## Goal

Make the first screen feel welcoming and understandable before exposing the game's full set of options. Keep the existing story, dark-purple/warm-gold visual identity, and accessibility features.

## Phase 1 — Focus the welcome screen

- Keep the story title, opening message, reassurance, and **Begin gently** as the primary action.
- Move chapter selection, graphics quality, assist toggles, debug tools, audio controls, keepsakes, and story navigation out of the pre-start view. They remain available after starting.
- Keep Settings and Controls & accessibility available from the welcome screen as secondary actions.
- Use a compact control summary instead of rendering all touch controls before the player begins.

## Phase 2 — Explain the first actions

- State the core keyboard bindings in plain language: arrows/A-D to move, Space to jump, Shift for Warm Light.
- Explain that touch movement controls appear after beginning; label the pulse control “Light” instead of relying on an icon alone.
- Show a short first-move guide after starting, and expand the Controls & accessibility help with keyboard, gamepad, touch, and gentle-play details.
- Do not force assist mode, change difficulty automatically, or remove player choice.

## Validation

- [ ] Confirm the initial screen has one visually dominant action and no pre-start touch-control cluster.
- [ ] Confirm Settings and Controls & accessibility are reachable before starting.
- [ ] Confirm touch controls, audio, keepsakes, chapter navigation, and assist options remain available after starting.
- [ ] Test keyboard, gamepad, and touch interactions; verify the Warm Light pulse still fires.
- [ ] Check narrow mobile and short-landscape layouts, text zoom, keyboard focus, and reduced motion.
- [ ] Run lint, unit tests, and production build in CI.

## Verification boundary

This change was made from repository source inspection. A real-device playtest and a fresh local lint/test/build run have not yet been completed in this environment. Do not treat the visual hierarchy or responsive behavior as player-validated until the checks above are performed.
