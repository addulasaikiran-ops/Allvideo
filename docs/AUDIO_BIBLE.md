# Audio Bible — Luminous Night-Garden Storybook

## Sound north star
A close, human-scale bedtime fable. Sound is tactile, warm and spacious: felted piano, breathy woodwinds, soft bowed strings, glass harmonica, plucked dulcimer and tiny bell harmonics. Leave silence between phrases. The companion should feel present, never needy; emotional cues invite attention rather than force it.

## Chapter score map
| Chapter | Mood | Tempo | Instrumentation and arrangement |
|---|---|---:|---|
| 01 · The Quiet Morning | tender, curious, safe | 72 BPM | Felt piano, music-box harmonics, soft cello, distant garden air; sparse melody with long rests |
| 02 · Tangle of Worries | restless but kind | 82 BPM | Muted pizzicato, bowed vibraphone, low strings, breathy clarinet; lightly syncopated tension layer |
| 03 · Sea of Distance | wistful, wide, patient | 68 BPM | Felt piano, low cello, glass harmonica, soft wave-like synth; broad stereo space and slow swells |
| 04 · Tower of Deadlines | ticking pressure, agency | 96 BPM | Woodblock/clock ticks, pizzicato strings, muted piano, restrained frame drum; rhythmic ostinato without harsh alarms |
| 05 · Mirror of Doubt | intimate, uncertain, compassionate | 76 BPM | Prepared piano, viola harmonics, reversed bell tails, soft breath; boss layer adds low strings rather than aggression |
| 06 · Memory Lane | warm nostalgia, belonging | 74 BPM | Nylon guitar, felt piano, celesta, warm strings, subtle field recordings; melody opens gradually |
| 07 · Fear — Reach | brave, vulnerable, resolute | 88 BPM | Low cello pulse, soft heartbeat, distant horn/woodwind, rising string harmonics; boss layer adds pulse, not volume shock |
| 08 · The Ending | release, gratitude, quiet hope | 70 BPM | Full felt-piano theme, celesta, gentle strings, guitar harmonics and garden ambience; resolve without a loud climax |

## Adaptive music rules
- Each chapter has synchronized base, tension and boss stems with identical bar length, BPM and musical origin.
- Start transitions on the next beat; prefer bar boundaries for major chapter changes. Crossfade stems over 1–2 bars and never hard-cut.
- Base is the emotional floor. Tension adds rhythmic detail and harmonic friction. Boss adds low pulse and sustained weight; do not simply make it louder.
- Dialogue ducks the music bus by roughly 6–9 dB, then restores slowly after the last line.
- Avoid abrupt loudness jumps. Target integrated loudness around -18 LUFS for music and peaks comfortably below -1 dBFS.

## World ambience
- Quiet Morning: high garden air, slow breeze, sparse glass chimes.
- Tangle: leaf rustle and low airy movement; no horror drones.
- Sea: slow waves, distant water, soft wind.
- Tower: a soft mechanical tick with roomy tail and occasional wind.
- Mirror: sparse glass resonance and low air; silence is part of the design.
- Memory Lane: breeze, distant waves, tiny chimes and occasional bird-like tones.
- Fear: low wind with a restrained heartbeat only at intentional story moments.
- Ending: layered garden breeze, gentle water, and infrequent bell shimmer.

## Procedural interaction sound
- UI hover: short, quiet upward sine tone; press: rounded descending tap; confirm: two-note rising interval; back: gentle downward interval.
- Footsteps are low and short, with surface-specific tone: moss is soft/damped, wood is woody, stone is low and dry, crystal is a tiny bell.
- Collectibles use a two-part chime. A short collection combo raises pitch and adds a quiet upper partial.
- Heartbeat is sparse, limited to intentional emotional beats or selected boss transitions, never a constant stress cue.
- Positional sounds use distance falloff and gentle stereo pan. UI remains centered.

## Source / commission placeholders
- [ ] chapter-01-base.ogg — felt piano + music box, 72 BPM
- [ ] chapter-01-tension.ogg — muted pizzicato/strings stem, synchronized
- [ ] chapter-01-boss.ogg — low cello pulse stem, synchronized
- [ ] chapter-02 base/tension/boss stems — restless leaf-and-string variations, 82 BPM
- [ ] chapter-03 base/tension/boss stems — sea-glass piano and wave texture, 68 BPM
- [ ] chapter-04 base/tension/boss stems — soft clockwork and pizzicato, 96 BPM
- [ ] chapter-05 base/tension/boss stems — prepared piano and mirror harmonics, 76 BPM
- [ ] chapter-06 base/tension/boss stems — nostalgic guitar/celesta/strings, 74 BPM
- [ ] chapter-07 base/tension/boss stems — brave low strings and heartbeat pulse, 88 BPM
- [ ] chapter-08 base/tension/boss stems — resolved main theme and garden shimmer, 70 BPM
- [ ] World loops: wind.ogg, waves.ogg, clock-soft.ogg, garden-chimes.ogg
- [ ] Surface footsteps: footstep-moss.ogg, footstep-wood.ogg, footstep-stone.ogg, footstep-crystal.ogg
- [ ] Interaction palette: ui-hover.ogg, ui-press.ogg, ui-confirm.ogg, ui-back.ogg, collect-heart.ogg, checkpoint.ogg
- [ ] Match stem duration/tempo and loop points, loudness-match, document licenses, and test phone speakers/headphones.

## Implementation notes
The Web Audio graph uses master/music/SFX/UI/ambience gain buses. Music streams through HTML audio routed into Web Audio, while interaction sounds are synthesized until licensed source assets are supplied. Manifest paths are placeholders; the music files are not included yet.
