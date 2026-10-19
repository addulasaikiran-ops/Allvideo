/**
 * Audio asset manifest. Replace these public URLs with commissioned/licensed audio.
 * Music streams through HTMLAudioElement; short effects are synthesized until assets arrive.
 */
export const AUDIO_MANIFEST = Object.freeze({
  chapters: {
    'chapter-01': { bpm: 72, base: '/audio/music/cc0-cathedral-forest-loop.ogg', tension: '/audio/music/cc0-dark-shrine-loop.ogg', boss: '/audio/music/cc0-dark-shrine-loop.ogg', ambience: ['wind', 'chimes'] },
    'chapter-02': { bpm: 82, base: '/audio/music/cc0-cathedral-forest-loop.ogg', tension: '/audio/music/cc0-dark-shrine-loop.ogg', boss: '/audio/music/cc0-dark-shrine-loop.ogg', ambience: ['wind', 'chimes'] },
    'chapter-03': { bpm: 68, base: '/audio/music/cc0-cathedral-forest-loop.ogg', tension: '/audio/music/cc0-dark-shrine-loop.ogg', boss: '/audio/music/cc0-dark-shrine-loop.ogg', ambience: ['waves', 'wind'] },
    'chapter-04': { bpm: 96, base: '/audio/music/cc0-cathedral-forest-loop.ogg', tension: '/audio/music/cc0-dark-shrine-loop.ogg', boss: '/audio/music/cc0-dark-shrine-loop.ogg', ambience: ['clock', 'wind'] },
    'chapter-05': { bpm: 76, base: '/audio/music/cc0-cathedral-forest-loop.ogg', tension: '/audio/music/cc0-dark-shrine-loop.ogg', boss: '/audio/music/cc0-dark-shrine-loop.ogg', ambience: ['wind', 'chimes'] },
    'chapter-06': { bpm: 74, base: '/audio/music/cc0-cathedral-forest-loop.ogg', tension: '/audio/music/cc0-dark-shrine-loop.ogg', boss: '/audio/music/cc0-dark-shrine-loop.ogg', ambience: ['wind', 'waves', 'chimes'] },
    'chapter-07': { bpm: 88, base: '/audio/music/cc0-cathedral-forest-loop.ogg', tension: '/audio/music/cc0-dark-shrine-loop.ogg', boss: '/audio/music/cc0-dark-shrine-loop.ogg', ambience: ['wind', 'heartbeat'] },
    'chapter-08': { bpm: 70, base: '/audio/music/cc0-cathedral-forest-loop.ogg', tension: '/audio/music/cc0-dark-shrine-loop.ogg', boss: '/audio/music/cc0-dark-shrine-loop.ogg', ambience: ['wind', 'chimes', 'waves'] },
  },
  effects: {
    jump: { kind: 'optional-file', src: '/audio/sfx/jump.ogg', bus: 'sfx' }, land: { kind: 'optional-file', src: '/audio/sfx/kenney-footstep-0.ogg', bus: 'sfx' }, collect: { kind: 'optional-file', src: '/audio/sfx/kenney-handle-coins.ogg', bus: 'sfx' },
    pulse: { kind: 'optional-file', src: '/audio/sfx/warm-light.ogg', bus: 'sfx' }, checkpoint: { kind: 'optional-file', src: '/audio/sfx/checkpoint.ogg', bus: 'sfx' }, heartbeat: { kind: 'optional-file', src: '/audio/sfx/heartbeat.ogg', bus: 'ambience' },
    hover: { kind: 'optional-file', src: '/audio/sfx/kenney-book-flip-1.ogg', bus: 'ui' }, press: { kind: 'optional-file', src: '/audio/sfx/kenney-book-close.ogg', bus: 'ui' }, confirm: { kind: 'optional-file', src: '/audio/sfx/kenney-book-open.ogg', bus: 'ui' }, back: { kind: 'optional-file', src: '/audio/sfx/kenney-door-close-1.ogg', bus: 'ui' },
    footstep: { kind: 'optional-file', src: '/audio/sfx/kenney-footstep-1.ogg', bus: 'sfx' },
  },
});
