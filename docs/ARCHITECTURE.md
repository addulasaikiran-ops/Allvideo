# Initial architecture

- `src/engine/`: plain ES modules; no React imports. Owns simulation state and game loop.
- `src/ui/`: React 18 presentation and accessible controls. Reads state through the external store; it must not drive the simulation.
- `src/story/personal.config.js`: single source for editable personal names, dates, photo URLs, and messages.
- `src/styles/` and CSS Modules: shared design tokens plus component-scoped styles.
- `public/personal/`: owner-provided photos only.
- `api/`: reserved for optional Vercel serverless functions; the initial game is static.
- `vercel.json`: SPA fallback, immutable caching for built hashed assets, revalidation for the HTML shell.

The current engine and UI are scaffolding only. Three.js is an approved dependency but the renderer and gameplay systems will be introduced in a subsequent implementation step.
