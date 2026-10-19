/**
 * Audio asset manifest. Replace these public URLs with commissioned/licensed audio.
 * Music streams through HTMLAudioElement; short effects are synthesized until assets arrive.
 */
export const AUDIO_MANIFEST = Object.freeze({
  chapters: {
    'chapter-01': { bpm: 72, base: '/audio/music/chapter-01-base.ogg', tension: '/audio/music/chapter-01-tension.ogg', boss: '/audio/music/chapter-01-boss.ogg', ambience: ['wind', 'chimes'] },
    'chapter-02': { bpm: 82, base: '/audio/music/chapter-02-base.ogg', tension: '/audio/music/chapter-02-tension.ogg', boss: '/audio/music/chapter-02-boss.ogg', ambience: ['wind', 'chimes'] },
    'chapter-03': { bpm: 68, base: '/audio/music/chapter-03-base.ogg', tension: '/audio/music/chapter-03-tension.ogg', boss: '/audio/music/chapter-03-boss.ogg', ambience: ['waves', 'wind'] },
    'chapter-04': { bpm: 96, base: '/audio/music/chapter-04-base.ogg', tension: '/audio/music/chapter-04-tension.ogg', boss: '/audio/music/chapter-04-boss.ogg', ambience: ['clock', 'wind'] },
    'chapter-05': { bpm: 76, base: '/audio/music/chapter-05-base.ogg', tension: '/audio/music/chapter-05-tension.ogg', boss: '/audio/music/chapter-05-boss.ogg', ambience: ['wind', 'chimes'] },
    'chapter-06': { bpm: 74, base: '/audio/music/chapter-06-base.ogg', tension: '/audio/music/chapter-06-tension.ogg', boss: '/audio/music/chapter-06-boss.ogg', ambience: ['wind', 'waves', 'chimes'] },
    'chapter-07': { bpm: 88, base: '/audio/music/chapter-07-base.ogg', tension: '/audio/music/chapter-07-tension.ogg', boss: '/audio/music/chapter-07-boss.ogg', ambience: ['wind', 'heartbeat'] },
    'chapter-08': { bpm: 70, base: '/audio/music/chapter-08-base.ogg', tension: '/audio/music/chapter-08-tension.ogg', boss: '/audio/music/chapter-08-boss.ogg', ambience: ['wind', 'chimes', 'waves'] },
  },
  effects: {
    jump: { kind: 'optional-file', src: '/audio/sfx/jump.ogg', bus: 'sfx' }, land: { kind: 'optional-file', src: '/audio/sfx/land.ogg', bus: 'sfx' }, collect: { kind: 'optional-file', src: '/audio/sfx/collect-heart.ogg', bus: 'sfx' },
    pulse: { kind: 'optional-file', src: '/audio/sfx/warm-light.ogg', bus: 'sfx' }, checkpoint: { kind: 'optional-file', src: '/audio/sfx/checkpoint.ogg', bus: 'sfx' }, heartbeat: { kind: 'optional-file', src: '/audio/sfx/heartbeat.ogg', bus: 'ambience' },
    hover: { kind: 'optional-file', src: '/audio/sfx/ui-hover.ogg', bus: 'ui' }, press: { kind: 'optional-file', src: '/audio/sfx/ui-press.ogg', bus: 'ui' }, confirm: { kind: 'optional-file', src: '/audio/sfx/ui-confirm.ogg', bus: 'ui' }, back: { kind: 'optional-file', src: '/audio/sfx/ui-back.ogg', bus: 'ui' },
  },
});
