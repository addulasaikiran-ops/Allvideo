# First-play quality pass and playtest script

## Purpose

Validate that a first-time player—whether or not they play games—can understand the invitation, move comfortably, discover the core interaction, and feel the story without being coached. This is a **playtest protocol and code-review checklist**, not a claim that a live browser session or human playtest has already passed.

## Setup and method

- Recruit 3–5 first-time players if possible: include at least one regular gamer and one person who rarely plays games.
- Use the same build and device/browser for comparable sessions; separately sanity-check a phone-sized viewport and keyboard navigation.
- Ask permission to take notes. Do not record video/audio or capture a face without explicit consent.
- Start with a clean browser profile or reset local progress so the player sees the intended first-run experience.
- Say only: **“This is a game I’m testing. Please play as you normally would and say what you’re thinking. I won’t explain unless you ask.”**
- Stay quiet for the first 60 seconds. Do not point at buttons, explain the controls, or correct a mistake. If safety or frustration requires intervention, note the intervention and why.

## The first 60 seconds (highest priority)

| Time | What to observe | Success signal | Friction signal |
|---|---|---|---|
| 0–10 s | Time to first meaningful paint; title hierarchy; whether the screen looks intentional | Player knows this is a story/game and where to begin | Blank/loading screen, competing calls to action, tiny/low-contrast text |
| 10–20 s | Reading and emotional response; first button choice | Reads or scans the title, then starts without prompting | Looks around for a start button, asks what the text means, assumes page is stuck |
| 20–35 s | First control discovery; keyboard/touch affordances | First movement/jump happens naturally; player understands feedback | Repeated wrong inputs, presses a control that appears inactive, cannot tell whether input registered |
| 35–50 s | First obstacle, collectible, companion cue, and audio | Player experiments, notices feedback, or smiles/laughs | Stops to decipher UI, walks past a crucial cue, repeated untelegraphed failure |
| 50–60 s | Motivation to continue; whether the next goal is clear | Player continues voluntarily or says what they want to try | Asks “what now?”, looks bored/overloaded, wants to quit due to confusion |

Record timestamps, not interpretations alone. Example: “At 00:24, pressed Jump three times; no visible response” is more actionable than “controls confusing.” Distinguish a thoughtful pause from a stuck pause by looking for purposeful scanning, trying a new action, or asking a specific question.

## Five questions for first-time players

Ask after the first minute and again after the session. Avoid defending the design or suggesting the “right” answer.

1. **“What did you think this game was asking you to do in the first minute?”**  
   Watch for: their own words for the goal; whether the start prompt and first objective are clear; a mismatch between intended and perceived genre.
2. **“Was there any moment you weren’t sure what to press or where to go?”**  
   Watch for: long pauses, repeated inputs, scanning around the screen, reaching for help, or the same confusion across players. Ask them to point to the exact moment.
3. **“What felt good, funny, sweet, or surprising—and what felt awkward?”**  
   Watch for: spontaneous smile/laugh, relaxed posture, a second attempt after a failure, or a specific sound/animation they mention unprompted. Don’t treat silence as a negative reaction.
4. **“How did the words and controls feel to read and use?”**  
   Watch for: squinting, leaning toward the display, skipping dense copy, misreading labels, tapping small targets, or needing a control repeated. Ask whether they prefer a hint or discover it themselves.
5. **“Would you want to keep playing, and what would you change first?”**  
   Watch for: an immediate reason to continue/stop, whether the next goal is clear, and one concrete improvement. Separate preference (“I like harder games”) from usability (“I couldn’t tell how to jump”).

## Observe, don't lead

Use this event log during play. Note a timestamp and exact action/quote; avoid guessing at emotions.

- **Hesitation:** a pause longer than about 5 seconds before a primary action, repeated scanning, hover without click, or reading a control several times. Mark what was on screen.
- **Stuck:** three or more repeated actions without progress, repeated deaths in the same place, or an explicit “I don’t know what to do.” Record whether a hint/assist appeared and whether it felt optional.
- **Delight:** spontaneous smile/laugh, leaning closer, pointing at a detail, repeating an interaction for fun, or quoting a line. Record the trigger rather than asking “wasn’t that cute?”
- **Overload:** rapid skipping, visible frustration, inability to read while playing, competing prompts, or repeated opening/closing of panels.
- **Transition friction:** surprise jump in camera, music volume, controls, loading time, story tone, or screen layout when a chapter/dialogue/menu/ending begins or ends.

### Quick event log

| Time | Screen/scene | Exact action or quote | Observable response | Severity (1–3) | Suggested follow-up |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |
| | | | | | |

## Final quality-pass checklist

### Typography consistency
- [ ] Display headings consistently use the display face; body, labels, controls, and help consistently use the body face.
- [ ] Heading scale and line-height are consistent across title, chapter overlays, dialogue, settings, memories, credits, and ending.
- [ ] Small text remains readable at 320 px width and at a comfortable handheld distance; check long names and translated/long copy for wrapping.
- [ ] Contrast remains sufficient over both bright and dark scene backgrounds; text shadows do not substitute for contrast.
- [ ] No visible font swap or layout shift delays the first meaningful action. Current CSS uses local font fallbacks; verify the target device actually has the intended fonts.

### Spacing and controls
- [ ] Use the existing spacing rhythm (4/8/12/16/24 px equivalents) for related UI; avoid one-off gaps without a reason.
- [ ] Buttons and touch controls have consistent height, radius, focus outline, disabled state, and pressed feedback.
- [ ] At mobile widths, primary actions are not buried below debug/settings controls; controls don't cover dialogue or game-critical action.
- [ ] Safe-area insets, landscape mode, browser zoom, and text scaling don't clip the stage or footer.
- [ ] Keep optional debug/tuning tools out of the recipient's primary visual path for the gift build; ensure intended players aren't exposed to developer-only controls.

### Microcopy and tone
- [ ] Use short, calm, specific verbs; keep the warm tone without making failure sound like blame.
- [ ] Match button labels to their actual action and state; avoid “Journey started” before a start action has completed.
- [ ] Hints are optional, actionable, and dismissible. Assist copy explains what changes and how to undo it.
- [ ] Avoid mixing metaphors or punctuation styles across hints, dialogue, toasts, settings, and ending.
- [ ] Error/offline copy offers a next step and does not promise that uncached audio or scenes work offline.

### Loading and performance
- [ ] On a throttled connection, measure first meaningful paint, time until Start is interactive, first scene readiness, and first audio readiness. Record median and worst case over at least 3 runs.
- [ ] Aim for first meaningful content within 2.5 s on the agreed target connection/device, and Start interactive within 3 s; treat these as project targets, not measured results.
- [ ] Confirm there is no long blank canvas while Three.js initializes; show a purposeful, accessible loading state if scene readiness takes time.
- [ ] Inspect bundle size, oversized audio/model assets, console errors, failed requests, and long main-thread tasks. Load optional panels and later-scene assets only when useful.
- [ ] Test cold cache, warm cache, slow network, offline reload, and recovery after reconnecting.
- [ ] Check audio starts only after a user gesture where required and that audio failure never blocks movement/play.

### Title screen and first minute
- [ ] The title, premise, and one primary action are visually obvious.
- [ ] The first control is discoverable without reading a wall of instructions; keyboard and touch affordances are clear.
- [ ] Player feedback is immediate and visible after move/jump/pulse/collect; sound is a bonus, not the only feedback.
- [ ] The first obstacle teaches one idea at a time and has a forgiving recovery path.
- [ ] The first minute does not require opening Settings, reading debug copy, or choosing among too many modes.

### Ending and every transition

Run the full sequence at least once and check each transition in both directions where possible:

- [ ] Title → first playable scene: no unexpected delay, input lock, or audio jump.
- [ ] Gameplay → dialogue/message: movement pauses intentionally, focus lands sensibly, and “Next/Close/Skip” labels match behavior.
- [ ] Dialogue → gameplay: controls resume; no stuck overlay or leftover audio intensity.
- [ ] Checkpoint/death → respawn: camera/player position, sound, hint, and checkpoint feedback agree; the player understands what persisted.
- [ ] Chapter → chapter, including chapter 6 Memory Lane and chapter 7 Fear: no stale HUD, wrong music, blank canvas, or misleading loading state.
- [ ] Gameplay → Settings/Chapters/Memories/Credits → return: prior state is intentional and the close/back action is discoverable.
- [ ] Photo Mode on/off and HUD/filter changes: visual controls reflect actual state and exiting restores the normal camera/HUD.
- [ ] Ending phases (reunion, waking, walk, message, credits, still): pacing feels deliberate; long holds are intentional; text remains readable; skip/exit controls are obvious and never trap the player.
- [ ] Ending → exit/replay/New Game+: state reset/retention is clear, and replay does not accidentally erase keepsakes.
- [ ] Update toast, install prompt, error boundary, 404, and offline fallback: no prompt covers a primary action; recovery paths work.
- [ ] Reduced motion, keyboard focus, screen reader labels, touch, and audio-off paths remain usable across all transitions.

## Triage and decision rule

After sessions, group notes by the moment they occur and count how many players encountered each issue. Fix in this order:

1. **Blockers:** can't start, move, recover, understand how to continue, or reach the ending.
2. **First-minute friction:** unclear title action, unresponsive-feeling controls, long blank loading, unreadable text, or an untelegraphed first failure.
3. **Emotional pacing:** dialogue timing, sound/music transitions, ending length, and any moment that interrupts the intended feeling.
4. **Polish:** spacing, wording consistency, animation easing, optional secrets, and cosmetic details.

A change is ready to re-test when it fixes the observed behavior without adding a new prompt or making the game less usable for a non-gamer. Record the commit/build and re-run the first 60 seconds after every change to the title, controls, loading, or first scene.

## Status note

The repository includes the React/Three.js game, optional assist systems, keepsake features, PWA support, and launch documentation. This document provides a structured audit and test script. Typography and spacing rules can be reviewed from source, but actual load-time measurements, emotional reactions, and transition validation require a real device/browser and first-time players; they should not be marked passed until observed.
