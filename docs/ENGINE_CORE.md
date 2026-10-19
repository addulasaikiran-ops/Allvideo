# Engine core

The engine is plain JavaScript ES modules and has no React dependency. Simulation runs at 60Hz and renders with interpolation; UI snapshots are throttled.

## Modules

- `game-loop.js`: fixed timestep, frame-gap cap, interpolation alpha, dropped-time accounting.
- `game-state.js`: validated transitions for Boot, Loading, Title, Playing, Paused, Cutscene, ChapterComplete and Ending.
- `input.js`: rebindable actions, keyboard/gamepad/touch support, automatic device detection and expiring press buffers.
- `camera.js`: smooth follow, velocity look-ahead, soft bounds, emotional zoom and reduced-motion-aware shake.
- `asset-manifest.js` / `asset-loader.js`: JSDoc typed-by-contract manifest, concurrent loading and progress/error events.
- `save-system.js`: versioned localStorage saves, sequential migrations, JSON export/import and checkpoint/chapter-end autosave hooks.
- `event-bus.js` / `store-bridge.js`: event payload contracts and throttled snapshots for React.
- `dispose.js`: cleanup helpers and Three.js-like geometry/material/texture disposal without importing Three.js.

## Integration

`createGameEngine()` exposes `store`, `input`, `eventBus`, `stateMachine`, `uiBridge` and `loop`. The existing UI can continue subscribing to `store`; React must not drive the simulation. Call `engine.destroy()` when the game surface unmounts.

The asset manifest currently lists optional placeholders only. Add production assets only after reviewing their license/source and documenting missing assets in `docs/ASSET_TODO.md`.
