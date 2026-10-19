# Keepsakes, Photo Mode, and Secrets

- Achievements celebrate hearts, wandering, and memory fragments; none require deathless runs or repetitive grinding.
- Daily letters are selected in sequence on a new calendar-day opening and configured in `src/story/personal.config.js`.
- Cosmetic unlock thresholds and inside-joke triggers are editable in the same personal config.
- Photo Mode provides camera framing, canvas filters, HUD toggle, and PNG export. Export captures the WebGL canvas only; DOM overlays and frame decorations are not composited into the PNG.
- Memory fragments are saved locally. The small fragment button is a manual discovery/debug affordance for this first pass; it is not yet wired to authored in-level pickups.
- The hidden memory gallery is a narrative unlock surface, not a new physics level. A fully playable secret stage and rendered character cosmetics need asset/level authoring.
- New Game+ restarts the story while keeping local keepsake data.
