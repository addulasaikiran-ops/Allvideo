# Game Design Document — Allvideo

**Status:** Narrative and gameplay target; implementation is a prototype  
**Target platform:** PC first (keyboard and controller), with responsive web delivery  
**Genre:** 2.5D story-platformer / gentle action-adventure  
**Target first playthrough:** 45–70 minutes  
**Tone:** Bittersweet, intimate, ultimately hopeful  
**Protagonists:** Yarla (playable) and Erven (the person she is trying to reach)

> **North star:** This is not a game about fixing someone. It is about staying present, learning how to listen, and finding a next step together.

This document describes the intended experience, not a claim that all listed features or content are already implemented. The current repository is an early technical prototype. See implementation notes and open questions near the end.

## 1. Pillars

1. **Warm, never cruel.** Worries may be uncanny and overwhelming, but never grotesque or gory. Failure is a pause, not a punishment. The world responds to patience as generously as it responds to skill.
2. **Love is a practice, not a superpower.** Warm Light opens possibilities, but progress comes from noticing, listening, respecting boundaries, and choosing the right kind of support. Yarla cannot simply blast sadness away.
3. **Always a way forward.** Every challenge has readable cues, safe recovery, and a route that can be softened by Assist Mode. Players may explore, rest, or continue without being shamed.

## 2. Experience and emotional contract

The player controls Yarla as she travels through symbolic inner worlds shaped by Erven's overwhelm, loneliness, burnout, self-doubt, and fear. The worlds are emotional landscapes, not diagnoses or literal depictions of a real person. The relationship references remain symbolic; do not insert real private memories, names, photos, dates, or identifying details into default content.

The story can explore deep vulnerability, miscommunication, distance, and the fear of not being enough. It must not suggest that love alone cures a mental-health condition, that Yarla is responsible for Erven's wellbeing, or that Erven owes recovery as a reward. Their resolution is mutual: Yarla offers care without taking over, and Erven practices letting himself be seen.

**Emotional safety rules**
- No gore, humiliation, relationship-as-scorekeeping, or punishment for missing collectibles.
- Worry-creatures are metaphors, not evil people and not Erven himself.
- Dialogue offers invitations, not coercion. Respect silence and boundaries.
- The ending is hopeful and affectionate, without promising that every difficult feeling disappears forever.
- Keep optional personal configuration in `src/story/personal.config.js`; ship only neutral fictional defaults.

## 3. Characters

### Yarla — playable heroine

- **Personality:** Attentive, stubborn in a tender way, emotionally brave but not always sure what to say. She wants to help quickly and learns that being present can matter more than finding the perfect answer.
- **Silhouette:** Compact, grounded shape; soft oversized jacket or short cape, practical boots, a distinct hair clip, and a lantern held close to the chest. Her outline should remain readable against dark scenery. Warm amber light traces her hands and the hem of her clothing.
- **Dialogue voice:** Clear, intimate, occasionally self-deprecating. Short sentences in moments of danger; longer, quieter thoughts at lanterns. She asks questions and leaves room for an answer. Avoid therapy jargon and grand speeches.
- **Signature animations:** A small two-handed lantern check before a difficult jump; leaning forward when she listens; shaking out her fingers after a hard landing; sitting with knees tucked up at a lantern.
- **Human details:** When nervous, she rubs the edge of her hair clip between thumb and forefinger. Her laugh begins as a quiet snort she tries unsuccessfully to hide. When she does not know what to say, she offers her hand palm-up rather than grabbing.

### Erven — the person Yarla is trying to reach

- **Personality:** Thoughtful, quietly funny, observant, and affectionate; when overwhelmed he withdraws or tries to make himself small. He is not a puzzle to solve. He has agency, preferences, and the right to take time.
- **Silhouette:** Taller and narrower than Yarla, with a gently sloped posture, long scarf, and a small constellation-like glow around the shoulders. As he feels safer, his silhouette opens and his shoulders settle; avoid a simplistic “dark form becomes cured” transformation.
- **Dialogue voice:** Dry, understated humor that sometimes deflects. Honest in fragments, with pauses and unfinished sentences. He may say “I don't know yet” without the game treating it as failure.
- **Signature animations:** Rolling one scarf end between his fingers; tapping a thumb against his knuckles while thinking; a delayed, shy wave when he notices Yarla; leaning his shoulder toward hers before he is ready to hold hands.
- **Human details:** He counts steps under his breath when anxious, then pretends he was humming. His laugh is a soft, surprised exhale that grows when Yarla laughs first. When embarrassed, he adjusts a scarf that is already perfectly straight.

**Animation principle:** Small changes carry the emotional story. Eye-line, hand position, distance, breathing, and timing matter more than large theatrical gestures. Never animate affection as automatic consent: hold-hand moments are offered and accepted.

## 4. Core loop and verbs

### Core loop

**Notice → traverse → encounter a worry → understand its pattern → respond with Warm Light or presence → open a route → collect a memory → rest at a lantern → continue.**

The player should regularly alternate between movement, observation, low-pressure interaction, and quiet emotional release. Avoid long stretches of platforming that have no narrative or sensory payoff.

### Player verbs

- **Move:** Run and walk across readable 2.5D paths. Let the player slow down for small details and dialogue.
- **Jump:** A forgiving, predictable single jump with clear landing feedback.
- **Double jump:** A second mid-air impulse, introduced in Chapter 2 and used for optional fragments as well as required routes.
- **Warm Light pulse:** A short-range, non-damaging pulse with a readable radius and cooldown. It can illuminate hidden routes, loosen shadow growth, reveal memory traces, and calm worry-creatures. It is not a universal attack: some puzzles require listening, waiting, or interacting instead.
- **Interact:** Inspect objects, activate lanterns, read memory fragments, and respond to contextual prompts.
- **Hold hands:** A brief, opt-in set-piece where Yarla and Erven synchronize pace or cross a vulnerable passage together. The player accepts the moment; no rapid button mashing or timed romance test.
- **Rest at lanterns:** Save a checkpoint, settle the music and lighting, review collected memories, and optionally hear a short character exchange. Rest is always safe.

### Warm Light rules

Warm Light represents attention and care, not control. Its visual language is amber-gold with a soft expanding ring. The response depends on the target:
- **Darkness:** reveal, thin, or reconfigure it; never erase the whole world in one blast.
- **Worry-creatures:** slow their movement, soften their edges, and expose a safe path or a need they represent.
- **Puzzles:** illuminate a connection, activate a resonance, or reveal a pattern.
- **Characters:** signal “I'm here”; it cannot force dialogue, affection, or emotional disclosure.

## 5. Eight-chapter emotional arc

The eight chapters are an intro, five inner worlds, a climactic confrontation, and an epilogue. The five inner worlds remain distinct and correspond to overwhelm, loneliness, burnout, self-doubt, and fear.

Intensity is a 1–10 measure of **dramatic pressure**, not sadness or quality. The boss and ending are the two emotional peaks. Quiet scenes around them are deliberate contrast, not filler.

### Intensity graph (text)

`Scale 1–10; each line is Start → Middle → End`

- **1. The First Lantern:** `2 → 3 → 2`
- **2. The Tangle (overwhelm):** `3 → 5 → 4`
- **3. The Quiet Between (loneliness):** `2 → 4 → 3`
- **4. The Long Dusk (burnout):** `3 → 5 → 3`
- **5. The Glass Garden (self-doubt):** `3 → 6 → 4`
- **6. The Listening Dark (fear):** `4 → 7 → 5`
- **7. The Storm That Stays (final boss):** `5 → 8 → 10`
- **8. Morning, Together (ending):** `6 → 8 → 10`

The emotional crest in Chapter 7 is the moment both characters stop fighting the feeling and make room for it. Chapter 8 reaches the second peak through a specific, earned act of mutual honesty and a visually rich, playable reunion—not through a bigger threat.

### Chapter map

| Chapter | Start emotion | Middle emotion | End emotion | Pacing / target time |
|---|---|---|---|---|
| 1. The First Lantern | Curiosity, uncertainty | Wonder and cautious trust | Tender anticipation | Gentle onboarding; 4–6 min |
| 2. The Tangle | Overwhelm, urgency | Focus amid manageable chaos | Relief with one loose thread | Quick, readable bursts; 6–8 min |
| 3. The Quiet Between | Loneliness, distance | Longing softened by discovery | Connection without a forced answer | Spacious and quiet; 5–7 min |
| 4. The Long Dusk | Fatigue, frustration | Permission to stop | Rest and self-compassion | Deliberate slowdown; 5–7 min |
| 5. The Glass Garden | Self-doubt, embarrassment | Recognition of inner criticism | A small, believable confidence | Rising challenge, gentle landing; 6–8 min |
| 6. The Listening Dark | Apprehension | Courage to look and listen | Vulnerability without full resolution | Suspense then release; 6–8 min |
| 7. The Storm That Stays | Dread mixed with care | Frustration becomes understanding | Deep release, closeness, catharsis | Three-phase boss; 7–10 min |
| 8. Morning, Together | Fragile relief | Mutual honesty and playful warmth | Earned joy and hope | Most polished final 10 min; 6–10 min |

**Total:** Approximately 45–64 minutes at the target pace, with room for optional exploration to reach 70 minutes. The first run should not require finding every collectible.

### Chapter 1 — The First Lantern

- **World theme:** Twilight meadow, floating stepping stones, tall grass, and the first warm lantern.
- **Human problem:** Not knowing how to begin a difficult conversation; caring but feeling unsure.
- **Mechanic:** Movement, single jump, interaction, lantern checkpoint, and a safe first Warm Light pulse.
- **Worry-creatures:** Tiny drifting “Hush Motes” that hide from bright spaces. They are curious, not hostile.
- **Hazards:** Wide gaps with forgiving ledges; no lethal-feeling surprise hazards.
- **Collectibles:** 2 hearts and 1 memory fragment about a small act of kindness.
- **Checkpoint rhythm:** One at the opening lantern and one just before the chapter exit; first checkpoint is nearly immediate.
- **Playtime:** 4–6 minutes.
- **Emotional beat:** Yarla finds a faint trail of light and chooses to follow without knowing exactly what she will find.

### Chapter 2 — The Tangle (overwhelm)

- **World theme:** Suspended pathways, drifting notes, looping signs, and softly multiplying objects.
- **Human problem:** Too many demands competing for attention; the sense that everything is urgent.
- **Mechanic:** Introduce double jump; Warm Light reveals the next meaningful route among visual noise.
- **Worry-creatures:** “Pilers,” small bundles of moving paper and threads that crowd platforms but can be calmed by a pulse and a pause.
- **Hazards:** Moving platforms and shifting bridges with clear rhythm cues; avoid simultaneous visual clutter and precision jumps.
- **Collectibles:** 3 hearts and 2 fragments about prioritizing and asking for help.
- **Checkpoint rhythm:** Every 60–90 seconds, and after the first double-jump test.
- **Playtime:** 6–8 minutes.
- **Emotional beat:** The solution is to choose one next step, not to clear every object.

### Chapter 3 — The Quiet Between (loneliness)

- **World theme:** A moonlit sea of clouds, distant lit windows, echoing platforms, and bridges that appear only when approached gently.
- **Human problem:** Feeling far away even when someone cares; the fear of being forgotten.
- **Mechanic:** Pulse reveals nearby routes, but a few bridges form only when the player waits or interacts with an echo. Teach that not every problem yields to action.
- **Worry-creatures:** “Echoes,” translucent silhouettes repeating the last movement they saw. They settle when approached slowly.
- **Hazards:** Slow drifting platforms and soundless-looking gaps made legible by particles and light cues.
- **Collectibles:** 3 hearts and 2 fragments about shared silence and being remembered.
- **Checkpoint rhythm:** At each major vista; low challenge density with long safe stretches.
- **Playtime:** 5–7 minutes.
- **Emotional beat:** Yarla leaves space beside her at a lantern; Erven's distant silhouette mirrors the gesture.

### Chapter 4 — The Long Dusk (burnout)

- **World theme:** An enormous dim clockwork garden, slow windmills, heavy petals, and a sun that never quite rises.
- **Human problem:** Exhaustion, overextension, and shame about needing rest.
- **Mechanic:** A rest-and-recharge cadence. Lanterns refill the pulse and temporarily slow nearby moving platforms. Optional routes reward stopping to notice, not speed.
- **Worry-creatures:** “Cinders,” tiny embers carrying too many sparks; when calmed, they release the extra sparks and float gently.
- **Hazards:** Slowly moving platforms and fading footholds with generous warning; no stamina depletion for simply standing still.
- **Collectibles:** 3 hearts and 2 fragments about rest without apology.
- **Checkpoint rhythm:** Frequent lanterns, usually 45–75 seconds apart.
- **Playtime:** 5–7 minutes.
- **Emotional beat:** The chapter's best route opens after the player rests. Doing less is explicitly a valid action.

### Chapter 5 — The Glass Garden (self-doubt)

- **World theme:** Mirrored leaves, translucent crystal flowers, and reflections that exaggerate tiny imperfections.
- **Human problem:** Harsh self-judgment, comparison, and fear of disappointing someone.
- **Mechanic:** Use pulse to distinguish stable platforms from distorted reflections. Optional routes reward experimentation; the game avoids grading the player's skill.
- **Worry-creatures:** “Second-Guessers,” little mirrored shapes that copy and then interrupt movement. A calm pulse causes them to hold still long enough to pass.
- **Hazards:** Reflections that shift after a clear cue; no instant-fail fake-outs.
- **Collectibles:** 3 hearts and 2 fragments about trying, apologizing, and accepting imperfection.
- **Checkpoint rhythm:** Before each new reflection pattern and after the first combined jump-and-pulse puzzle.
- **Playtime:** 6–8 minutes.
- **Emotional beat:** Erven admits that he sometimes hears criticism in silence, even when nobody is criticizing him.

### Chapter 6 — The Listening Dark (fear)

- **World theme:** A dark forest of tall silhouettes, distant lanterns, and paths visible only at the edge of the light.
- **Human problem:** Fear of being a burden, fear of being left, and the impulse to hide before rejection can happen.
- **Mechanic:** Pulse in short, considered bursts; observe enemy patterns, then choose to calm, wait, or move around. Introduce a nonverbal “stay nearby” interaction.
- **Worry-creatures:** “Wakes,” large shadow shapes that swell when chased and soften when given space and a steady light.
- **Hazards:** Moving shadow curtains and narrow ledges with obvious telegraphs and safe retry space.
- **Collectibles:** 3 hearts and 2 fragments about naming a fear without letting it make every decision.
- **Checkpoint rhythm:** At the entrance, after the first Wakes encounter, and before the chapter's final crossing.
- **Playtime:** 6–8 minutes.
- **Emotional beat:** The dark remains present, but it no longer owns the whole screen. Yarla asks whether Erven wants company; he chooses to let her stay.

### Chapter 7 — The Storm That Stays (final boss)

- **World theme:** A storm-shaped inner landscape where visual motifs from all five worlds circle a quiet center.
- **Human problem:** Feelings can recur even after they have been understood; trying to force them away can make them larger.
- **Mechanic:** Three phases built around emotional understanding, not damage. No health bar and no attacks against Erven.
- **Worry-creatures:** The “Stormkeeper” is a knot of the previous worries, not Erven's true self and not a villain to kill.
- **Hazards:** Familiar patterns recombine, with readable tells. A mistake gently resets the current pattern, not the whole fight.
- **Collectibles:** 2 hearts and 1 optional fragment; none required to finish the boss.
- **Checkpoint rhythm:** At the arena entrance; each phase remembers completed lessons on retry.
- **Playtime:** 7–10 minutes.
- **Emotional beat:** Yarla stops trying to make the storm disappear. Erven names what he can, admits what he cannot yet explain, and chooses to reach back.

#### Boss: three phases of understanding

1. **Notice the storm — observe before acting.** The Stormkeeper grows when the player pulses continuously. Read the rhythm, wait for a quiet gap, then use one careful pulse to reveal the feeling beneath the noise. Lesson: attention begins with noticing, not fixing.
2. **Make room — respect boundaries.** The arena offers a tempting close approach, but the Stormkeeper recoils if Yarla crowds it. The player keeps a respectful distance and interacts only when a hand-shaped prompt appears. Lesson: care is offered, not imposed.
3. **Stay together — comfort without erasure.** The storm returns in softer waves. The player holds a steady light while Erven speaks; when invited, Yarla offers her hand. The player accepts the invitation and keeps pace rather than mashing a button. The storm settles into a ring of stars but does not vanish. Lesson: a feeling can remain without being faced alone.

**Boss success state:** A shared breath, relaxed posture, and an environment that becomes navigable. No death animation, damage number, or triumphant strike.

### Chapter 8 — Morning, Together (ending)

- **World theme:** The same meadow as Chapter 1, now lit by dawn; the path includes motifs from every world, still imperfect but connected.
- **Human problem:** Returning to everyday life after an intense conversation; hope without pretending the hard parts are permanently over.
- **Mechanic:** A brief playable walk, one optional gentle platforming sequence, a hold-hand moment, and a final lantern interaction. Do not introduce a new complex mechanic.
- **Worry-creatures:** Familiar creatures appear at a distance, calm and still part of the landscape.
- **Hazards:** None that threaten progress. The ending is a safe, readable space.
- **Collectibles:** 2 hearts and 1 final memory fragment; all are optional.
- **Checkpoint rhythm:** One at the start of the chapter. The finale autosaves before the closing scene.
- **Playtime:** 6–10 minutes.
- **Emotional beat:** Erven shares one honest thought; Yarla answers with a small, grounded truth rather than a perfect speech. They walk forward together, not because every problem is solved, but because both choose the next step.

**Final ten-minute quality mandate:** The end of Chapter 7 and all of Chapter 8 must receive the highest polish budget: best character animation, facial/pose readability, lighting transitions, music and sound mix, dialogue timing, accessibility review, and QA. Reserve schedule for a dedicated polish pass and playtest. Do not add a late collectible grind or a new difficult mechanic here. The boss and ending are the emotional peaks; the ending's quiet details must feel earned.

## 6. Difficulty and flow theory

Design for flow by balancing challenge with the player's growing skill. Each core mechanic follows **Introduce → Practice → Twist → Test**. Tests should feel like synthesis, not a surprise exam. Give immediate readable feedback and safe recovery.

| Mechanic | Introduce | Practice | Twist | Test |
|---|---|---|---|---|
| Move / jump | Ch. 1: wide, safe gaps | Ch. 1: varied ledges | Ch. 2: visual distractions | Ch. 5: stable vs. reflected footing |
| Double jump | Ch. 2: a safe demonstration | Ch. 2: short platform sequence | Ch. 5: combine with reading reflections | Ch. 6: use only where needed, with a safe route |
| Warm Light | Ch. 1: reveal a nearby path | Ch. 2: reveal routes in clutter | Ch. 3–4: waiting/resting may be better | Ch. 7: measured pulse rather than spam |
| Enemy calming | Ch. 2: one harmless Piler | Ch. 3–4: observe and approach | Ch. 6: space matters | Ch. 7: respect distance and invitation |
| Rest / checkpoints | Ch. 1: lantern tutorial | Ch. 4: rest as a deliberate choice | Ch. 6: rest before a tense passage | Ch. 7: phase progress persists on retry |
| Hold-hand moments | Ch. 3: optional gesture preview | Ch. 6: accepted company | Ch. 7: invitation and consent | Ch. 8: unhurried shared walk |

### Difficulty guardrails

- A new mechanic gets a safe, non-punishing introduction before any hazard depends on it.
- Avoid requiring simultaneous precision movement, rapid pulse timing, and reading dense dialogue.
- Use animation, particles, sound, and shape—not color alone—to communicate hazard states.
- Keep mandatory routes forgiving; place optional challenge and collectibles off the critical path.
- Respawn immediately at the latest checkpoint. Do not remove hearts, fragments, or progress on failure.
- If repeated misses occur, suggest Assist Mode discreetly without implying the player is doing badly.

### Assist Mode

Offer toggles individually and a clear preset. Settings are available before starting and from pause.

- **Invulnerability / safe traversal:** Hazards cannot interrupt progress; falls return Yarla to the last safe ledge or checkpoint.
- **Slower hazards:** Moving platforms, shadow curtains, and timed patterns run at a reduced speed. Dialogue and animation remain natural.
- **Auto-checkpoints:** Activate at chapter transitions and after major puzzles/boss phases.
- **Generous jumps:** Increase coyote time, jump forgiveness, and double-jump window.
- **Warm Light assist:** Increase pulse range and reduce cooldown for puzzle use.
- **Dialogue pacing:** Pause action during important dialogue and allow the player to advance text at their own speed.
- **Reduced motion / visual comfort:** Reduce camera motion, parallax, flicker, and intense transitions.

### “Just let me enjoy the story” option

A single story-first preset turns on invulnerability, slower hazards, auto-checkpoints, generous jumps, and reduced pressure from puzzle timing. Optional collectibles remain optional. The game should not label this “easy,” alter the ending, lock achievements, or lower rewards. The player can switch settings at any time without restarting.

## 7. Progression and rewards

Progression should reward curiosity and emotional attention without turning intimacy into a score.

### Memory Gallery

- A calm, accessible gallery available from the title screen and chapter-end screens.
- Each collected fragment unlocks a small vignette: a sketch, a few lines of dialogue, an environmental detail, or a short animation.
- Group memories by chapter/world, with clear collected and undiscovered states that do not reveal spoilers by default.
- Missing a fragment never blocks the ending. Chapters can be replayed.
- Default memories are symbolic and fictional. Personal photos or messages are opt-in additions through the approved configuration file only.

### Hearts and fragments

- **Hearts:** Small optional tokens that add a warm visual accent to the gallery or chapter recap. They do not represent Erven's health or Yarla's worth.
- **Memory fragments:** Optional narrative pieces that expand context and unlock gallery entries.
- Neither is consumed on failure. Avoid implying that collecting hearts means earning affection.

### Chapter stars

Award 1–3 stars per chapter for a mix of exploration, interaction, and optional discovery—not speed, deaths, or combat performance. A low rating never blocks content, cosmetics, the boss, or the ending. Show a neutral “chapter complete” result first; stars are supplementary feedback and can be improved on replay.

### Achievements

Use warm, non-shaming names. Example set:
- **One Small Step:** Finish Chapter 1.
- **Room to Breathe:** Rest at every lantern in a chapter.
- **Not Everything Needs Fixing:** Calm a worry-creature without rushing it.
- **A Little More Light:** Find half the memory fragments.
- **Good Listener:** Complete a listening-based puzzle without repeated pulses.
- **Here, If You Want:** Complete the optional hold-hand moment.
- **Together, Still:** Finish the story.

Achievements must not require speedrunning, repeated failure, or intrusive real-life disclosures.

### Cosmetics

Unlock non-statistical, non-romance-gated options:
- Hair clips, including a tiny star and a leaf.
- Scarves with different patterns and lengths.
- Color trails for jumps and Warm Light, with contrast-safe presets.
- Lantern wraps and soft particle motifs.

Cosmetics are earned through exploration and chapter completion, never through star thresholds that block less-skilled players. Make all visual settings legible and avoid color-only differentiation.

## 8. Narrative and dialogue guidelines

- Use short, specific lines over exposition. Let level geometry and animation carry meaning.
- Avoid diagnostic labels and claims that a person can be healed by one perfect conversation.
- Let Erven disagree, joke, pause, or decline. Let Yarla admit uncertainty.
- Make silence intentional: a pause should have a visual or musical reason, not feel like a broken trigger.
- Use humor as shared relief, not as a way to dismiss vulnerability.
- Do not write the relationship as one person endlessly giving and the other only receiving. Give both characters choices, needs, and moments of care.
- Any future personalization should be opt-in and reviewed by the project owner; do not infer real memories from user data.

## 9. Audio, visual direction, and polish

**Visual language:** Layered 2.5D depth, readable silhouettes, restrained bloom, soft parallax, and a distinct palette for each world. Darkness is an absence of information that can be explored, not a horror filter. Keep motion and visual noise under control.

**Palette arc:** Twilight amber/indigo → tangled coral/blue → moon silver/teal → dusk mauve/amber → glass lilac/rose → forest navy/gold → storm violet/amber → dawn peach/blue. Keep hazard cues distinguishable in grayscale and high contrast.

**Audio:** A gentle motif for each world, with a shared two-note motif for the characters. Let the arrangement thin out when Erven struggles to speak. The boss resolves through breathing, sustained tones, and harmony—not a combat fanfare. The ending should feel warm and spacious, not bombastic.

**Production rule:** Procedural geometry, synthesized audio, or temporary visuals are prototypes unless explicitly reviewed and marked production-ready. Document missing assets and license-safe sourcing in `docs/ASSET_TODO.md`.

## 10. Scope and total length

- **Target first play:** 45–70 minutes.
- **Critical path:** Approximately 45–55 minutes for a player who follows the main route and does not stop for every optional item.
- **Exploration-rich run:** Approximately 60–70 minutes.
- **Replay:** Chapter select and gallery cleanup, without forcing a second full playthrough.
- **Target PC controls:** Keyboard and gamepad; browser-first delivery remains lightweight. Mobile adaptation is a later responsive goal, not the first optimization priority.

These are design targets to validate with playtests, not measured timings yet.

## 11. Cut lines

### Must-have (ship blocker)
- Eight-chapter emotional arc with five distinct inner worlds.
- Responsive movement, jump, double jump, collision, checkpoints, and gentle respawn.
- Warm Light with puzzle, darkness, and enemy-calming uses.
- Three-phase comfort-based boss and a complete, polished ending.
- Story-first Assist Mode, reduced motion, readable cues, and no punishment for failure.
- Memory fragments, basic Memory Gallery, chapter progression, and save/resume behavior.
- Strong dialogue timing and clear animation/visual feedback for Yarla and Erven.
- All required assets either licensed and approved or clearly marked as placeholders.
- Verified lint, tests, and production build.

### Should-have (important, cut only with a deliberate scope decision)
- All planned worry-creature behaviors and distinct hazard patterns.
- Chapter star summaries and a useful achievement set.
- Cosmetic unlocks: hair clips, scarves, trails.
- Chapter select and replay.
- Audio motifs and a dedicated mix/polish pass for the final ten minutes.
- Controller remapping, adjustable text size, high-contrast mode, and full reduced-motion options.

### Nice-to-have (first to defer)
- Additional optional memory vignettes and environmental micro-stories.
- More cosmetic sets and alternate lantern designs.
- Extra dialogue variations after chapter replay.
- Optional photo-based personalization, only when explicitly provided and approved by the owner.
- Additional post-ending free exploration or a developer-facing gallery editor.

## 12. Risks and open questions

### Risks and mitigations

- **Scope exceeds a short game:** Eight chapters, bespoke enemies, a gallery, cosmetics, and a three-phase boss can exceed the schedule. Protect the critical path and reuse mechanics with distinct art and emotional meaning.
- **Emotional content feels prescriptive:** Avoid presenting one communication style as universally correct. Use invitations and allow characters to be uncertain.
- **Love becomes a cure narrative:** Keep the storm present in a transformed, manageable form. The characters support each other; neither becomes responsible for fixing the other.
- **Platforming disrupts intimate pacing:** Put difficult jumps on optional paths, keep main routes forgiving, and never put a long emotional line over a precision hazard.
- **Accessibility arrives too late:** Design with shape, timing, labels, and Assist Mode from the first playable slice. Test story-first mode throughout.
- **Finale polish is squeezed out:** Reserve the final ten minutes as the highest-priority animation, audio, lighting, and QA budget. Freeze new features before the polish pass.
- **Prototype is mistaken for production:** Mark placeholder art/audio clearly; maintain the asset TODO; test behavior instead of claiming visuals are finished.
- **Personal data enters the repository:** Keep defaults fictional, do not commit private photos/messages, and isolate personalization in the designated config and public folder.

### Open questions

1. What is the desired release format for PC-first: browser game only, installable desktop wrapper, or both?
2. Should all eight chapters be available in one continuous run, or should chapter select unlock after the first completion?
3. What exact save model is desired (local browser save only, export/import, or optional account sync)?
4. How much spoken audio, if any, is in scope versus text dialogue with sound cues?
5. What is the budget and target schedule for original character animation, music, and sound?
6. Should star ratings be visible by default or tucked away for players who prefer no performance feedback?
7. Are the proposed chapter names and the eight-part structure approved, or should the five inner worlds be counted differently?
8. Which accessibility options are required for the first public demo, beyond the story-first preset and reduced motion?

## 13. Acceptance checklist for the first complete version

- [ ] A first-time player can finish the main story in 45–70 minutes without collecting everything.
- [ ] Each core mechanic follows introduce → practice → twist → test.
- [ ] All eight chapters have a distinct emotional rhythm and a clear chapter-end beat.
- [ ] Boss phases teach notice, respect boundaries, and stay together; none is solved by damage.
- [ ] The final ten minutes are visibly and audibly the most polished section.
- [ ] The ending is hopeful without implying that difficult feelings vanish forever.
- [ ] Assist Mode and “Just let me enjoy the story” can be enabled at any time.
- [ ] Failure never removes progress or shames the player.
- [ ] No private or identifying relationship details appear in default content.
- [ ] The implementation status is documented honestly; lint, tests, and production build are run and reported.
