# Luminous Night-Garden Storybook — Art Bible

## North star
A hand-painted bedtime fable after blue hour: velvety indigo shadows, layered botanical silhouettes, soft gold-rose rim light, luminous keepsakes, and quiet negative space. The world should feel emotionally present without visual noise. Gameplay readability always outranks decoration.

## Chapter palettes
| Chapter | Palette | Light and atmosphere |
|---|---|---|
| 01 · The Quiet Morning | ink plum #1C1B35, dusty lilac #454065, rose-clay #D79BBD, lantern gold #FFE7A4 | Low warm key, misty edges, sparse mint fireflies |
| 02 · Tangle of Worries | bramble #30213B, thorn rose #B06F8E, muted jade #8ED7B5, amber #F3C889 | Cool violet fill, rose rim, denser drifting motes |
| 03 · Sea of Distance | deep tide #172B46, sea-glass #8CE3D6, moon silver #C4D8FF, coral #E9A9D0 | Blue fog, soft water caustics, slow floating lights |
| 04 · Tower of Deadlines | midnight blue #202846, parchment #E5C6A0, clock gold #FFD49A, storm teal #719B91 | Sharper pools of amber light; thin rain only during story beats |
| 05 · Mirror of Doubt | aubergine #29213D, mirror lilac #D5C8F2, rose #E9A9D0, candle cream #FFF1D1 | Reflected highlights, low-contrast fog, no harsh horror lighting |
| 06 · Memory Lane | dusk teal #294653, faded rose #D79BBD, memory gold #F5C78D, pale mint #B9F2D0 | Golden-hour halos, petals and fireflies, gentle bloom |
| 07 · Fear — Reach | storm ink #161C35, distant blue #9CC5FF, signal gold #FFE0A0, hopeful mint #B9F2D0 | Deepest shadows, one readable warm beacon, restrained god-rays |
| 08 · The Ending | night garden #242039, flower blush #FFB7C8, lantern gold #FFE7A4, dawn mint #C7E7D8 | Warm rose-gold rim, drifting petals, soft cutscene focus and slow stars |

## Shape language
- Safe / supportive: rounded capsules, circles, soft arcs, open petals, broad leaves.
- Uncertainty: overlapping tendrils, offset silhouettes, gently irregular curves; never spiky noise everywhere.
- Time pressure: long narrow rectangles and clock arcs; reserve sharp geometry for readable hazards.
- Reflection / doubt: symmetrical frames with slight hand-made imperfections and softened edges.
- Collectibles and guidance: small luminous shapes with a clear silhouette and quiet halo.
- Characters: rounded, compact silhouettes; gestures and posture communicate emotion before facial detail.

## Lighting rules
1. Main fill is cool moon-blue or muted teal; a warm lantern-gold key anchors the eye.
2. Use paired gold and rose rim lights at low intensity. Never outline every object equally.
3. Bloom only bright emissive accents; keep UI, platforms, and character edges crisp.
4. Fog is chapter-tinted and distance-based; never obscure jumps, hazards, or interactive objects.
5. God-rays are subtle, local, and optional on Low quality. No full-screen white shafts.
6. Cutscene depth-of-field is shallow but never blurs captions or interactive choices.
7. Color grade may tint shadows and highlights, but preserve skin, accessibility contrast, and collectible color distinction.
8. Film grain is optional, monochromatic, and nearly imperceptible; disabled on Low and under reduced-motion preferences.
9. Motion uses slow wind sway, drifting motes, and restrained water shimmer. Avoid rapid flashing and strong camera shake.

## Parallax and atmosphere
Build at least five independently scrolling planes: (1) sky gradient/stars, (2) far moon/cloud silhouettes, (3) distant hill or canopy, (4) midground trees/ruins, (5) near shrubs/flowers, plus optional foreground grass. Move far layers at 0.08–0.2 camera speed and foreground at 0.7–0.9. Fog should blend the farthest plane into the chapter background.

## Ambient particle vocabulary
- Fireflies: warm pinpoints, irregular slow drift; chapters 01, 02, 06, 08.
- Petals: broad translucent pink shapes; chapters 06 and 08, especially memory transitions.
- Light motes: cool teal/blue specks; chapters 02, 03, 05, 07.
- Rain: sparse diagonal streaks; chapter 04 and selected chapter 03 beats.
- Snow: slow pale flakes reserved for bespoke story moments, not the default night garden.
- Stars: distant, low-contrast twinkle in all chapters, most visible in 01 and 08.

## Shader / material direction
Prefer a three-band toon ramp with soft transitions and a hand-painted albedo texture. Use a thin dark-violet outline selectively on characters and interactables. Wind deforms foliage tips only; water uses a low-amplitude vertex wave and scrolling normal map. Avoid expensive transparent overdraw on mobile.

## Graphics presets and performance budget
- Low: DPR ≤ 0.8, no bloom/DoF/grain/god-rays, 30–50 ambient particles, no dynamic shadows.
- Medium: DPR ≤ 1.0, restrained bloom, light vignette and chapter grade, 70–100 particles, no DoF outside cutscenes.
- High: DPR ≤ 1.5, bloom and grade, optional cutscene DoF and fine grain, 100–150 particles, subtle god-rays.
- Auto scaler samples frame time; if sustained FPS falls below 50, lower DPR first, then disable DoF/grain and reduce bloom and shadow cost. Recover gradually after stable performance. Never alter gameplay physics to save frames.

## Source or commission checklist
- [ ] 8 chapter sky/atmosphere matte paintings (16:9 plus wide parallax extension).
- [ ] 5–7 transparent parallax plates per chapter: sky, clouds, distant canopy/hills, midground silhouettes, near foliage, foreground grass.
- [ ] Character turnarounds and expression/pose sheets: curled-up, looking away, tired, hopeful, smiling, walking, hand-holding.
- [ ] Hand-painted material set: moss, moonlit stone, weathered wood, sea-glass, mirror, petals, cloth, bark.
- [ ] Seamless water normal/foam textures and low-frequency ripple masks.
- [ ] Wind-bent leaf and grass atlases; flower clusters with varied silhouettes.
- [ ] Firefly, petal, rain, snow, and light-mote sprite sheets (transparent, premultiplied-alpha friendly).
- [ ] Gold/rose rim-light and soft god-ray masks; keep beams local and art-directed.
- [ ] Story props: scarf, lantern, ribbon, bottle, mirror frame, keepsake flower, clockwork details.
- [ ] Ambient loops: night-garden insects, soft wind, distant water, rain-on-leaves, gentle chime; provide silent fallbacks.
- [ ] Chapter-specific LUTs or documented grade values, with color-blindness and contrast review.
- [ ] KTX2 source textures where GPU-friendly compression matters; WebP for UI/background plates; glTF models with Draco or Meshopt compression.
- [ ] Confirm licenses, source files, target resolutions, atlas padding, mipmaps, and mobile budgets for every commissioned asset.
