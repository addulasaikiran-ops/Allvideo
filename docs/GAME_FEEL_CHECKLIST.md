# Game-feel pass — before / after checklist

## Before
- [ ] Impacts and landings had no dedicated hit-stop or camera response.
- [ ] Collectibles required direct overlap; no magnet easing or sparkle trail.
- [ ] Pickups, pulses, and checkpoints lacked concise visual feedback cues.
- [ ] No shared intensity setting controlled screen shake, particles, and haptics.
- [ ] Touch haptics and controller rumble were not integrated.

## After
- [x] Short, scaled hit-stop on landings and impact events.
- [x] Nearby collectibles ease toward the player before pickup.
- [x] Pickup +1 labels and sparkle accents for pulses, pickups, knots, bridges, and checkpoints.
- [x] Juice intensity: Off / Low / Full, persisted locally.
- [x] Best-effort gamepad rumble and touch navigator.vibrate; unsupported APIs safely no-op.
- [x] Existing rest-lantern time-slow retained; emotional events can request a slow cue.
- [x] prefers-reduced-motion disables shake, particles, and time-slow cues.

## Motion-sensitivity risk review
- **Highest risk:** camera shake/dips, hit-stop or time dilation, fast/high-contrast bursts, and repeated screen-space motion can cause discomfort, disorientation, or nausea. Offer Juice Off and honor reduced-motion preferences.
- **Medium risk:** sparkle trails and drifting/popping numbers. Keep brief, low-density, and suppressible.
- **Variable risk:** vibration and controller rumble can be startling or uncomfortable. Keep brief, intensity-scaled, and fully removable with Juice Off.
- Gameplay information must remain readable without any of these effects.
