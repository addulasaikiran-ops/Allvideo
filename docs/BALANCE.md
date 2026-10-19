# Difficulty and pacing balance audit

**Scope:** mixed audience of experienced platformers and first-time players. The goal is to offer help without taking control away from the player.

## Changes made

- [x] **Repeated-death prompt:** after three deaths at the same coarse location during the current chapter run, show an optional “Need a hand?” prompt. “Keep going” dismisses it; no assist is forced.
- [x] **Temporary assistance choices:** the prompt can enable slower simulation speed or set a nearby temporary checkpoint. Both are opt-in and can be changed again.
- [x] **Assist Mode controls:** independent toggles for invulnerability, auto-jump, slower game speed, larger platform landing windows, and auto-pulse. The existing general Assist Mode jump boost remains available.
- [x] **Local-only death telemetry:** deaths are bucketed by chapter and coarse world-coordinate ranges and stored in local browser storage. No network request, account ID, name, or input history is recorded. The F3 level-debug panel lists the top 12 hotspots and offers a clear action.
- [x] **Telemetry is optional:** if storage is blocked, gameplay continues without persisted hotspot data.

## Chapter playtime audit

The authored level data contains these target ranges:

| Chapter | Title | Target |
| --- | --- | ---: |
| 1 | The Quiet Morning | 4–6 min |
| 2 | Tangle of Worries | 6–8 min |
| 3 | Sea of Distance | 6–8 min |
| 4 | Tower of Deadlines | 7–9 min |
| 5 | Mirror of Doubt | 7–9 min |

**Finding:** these are design targets in level metadata, not measured results. A repeatable playtest or automated traversal harness is needed to confirm actual median and 90th-percentile completion times for first-time and experienced players. Chapters 6–8 use bespoke story screens and are not represented by these five platform-level timing targets.

## Checkpoint spacing audit

**Target:** no more than two minutes of play between checkpoints.

**Finding:** level files define checkpoint entities, but world-space distance alone cannot establish elapsed time—vertical sections, hazard waits, deaths, and player skill change traversal time. This pass adds an optional temporary checkpoint after repeated failures, but does not claim that every existing interval has been proven to be under two minutes. During playtesting, record time between each `checkpoint:reached` event; split or add a checkpoint anywhere the 90th-percentile interval exceeds 120 seconds.

## Emotional pacing

- Added optional rest-lantern recovery beats near the end of chapters 1, 2, 3, and 5; chapter 4 already has three rest-lanterns, including one near the top of the tower.
- These are low-demand interactions with a gentle text cue, optional healing, and a short slow-time effect rather than another timed obstacle.
- **Verification status:** chapter-end calm beats are present in the five platform levels. A full playthrough review is still needed to ensure a calm beat follows *every* intense section, especially the bespoke story chapters 6–8.

## Suggested before / after playtest checklist

### Before
- [ ] Record chapter completion time for a first-time player and a returning player.
- [ ] Time each checkpoint-to-checkpoint segment.
- [ ] Mark sections where a player dies repeatedly or asks what to do next.
- [ ] Mark intense sections and whether a calm beat follows them.

### After
- [x] Repeated deaths can trigger an optional help prompt; players can dismiss it.
- [x] Individual assist controls are available without requiring the whole set.
- [x] Local death hotspots can be reviewed from the F3 debug panel.
- [ ] Verify chapter median times against the target ranges with observed playtests.
- [ ] Verify every checkpoint interval is at most 120 seconds at the 90th percentile.
- [ ] Verify a calm beat follows every intense section in all chapters, including bespoke story chapters.
- [ ] Test keyboard, gamepad, and touch; test each assist alone and in combination.

## Implementation notes and limitations

- The death prompt threshold is three deaths per coarse location **within the current chapter run**; the local telemetry counter persists across runs for hotspot review.
- “Larger hit windows” currently increases the platform landing snap tolerance; it is not a universal enlargement of every hazard or interaction collider.
- “Slower game speed” slows the player and level simulation together to preserve relative motion.
- Auto-jump triggers while grounded and moving; auto-pulse attempts a pulse when a hazard is nearby and the pulse is ready.
- Invulnerability prevents the fall-death trigger. It does not promise immunity from every future damage type.
- Temporary checkpoints are session-only and are not written into the save file.
- Time targets and checkpoint timing remain **playtest items**, not claims of measured compliance.
