import { AUDIO_MANIFEST } from './manifest.js';

const BUS_NAMES = ['music', 'sfx', 'ui', 'ambience'];
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, Number(value) || 0));

export function createAudioSystem({ AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext, createAudio = () => new Audio() } = {}) {
  let context = null, master = null, buses = {}, unlocked = false;
  let chapter = 'chapter-01', intensity = 'base', musicLayers = [], ambienceNodes = [];
  let dialogueActive = false, lastCollectAt = 0, collectCombo = 0, chimeTimer = null;
  const settings = Object.fromEntries(['master', ...BUS_NAMES].map((name) => [name, {
    level: name === 'master' ? 0.85 : name === 'music' ? 0.38 : name === 'ambience' ? 0.28 : 0.7, muted: false,
  }]));

  function ensureContext() {
    if (context || !AudioContextClass) return context;
    context = new AudioContextClass();
    master = context.createGain(); master.gain.value = settings.master.level; master.connect(context.destination);
    for (const name of BUS_NAMES) {
      buses[name] = context.createGain();
      buses[name].gain.value = settings[name].muted ? 0 : settings[name].level;
      buses[name].connect(master);
    }
    return context;
  }
  function setGain(gain, value, at = context?.currentTime ?? 0, duration = 0.04) {
    if (!gain || !context) return;
    gain.gain.cancelScheduledValues(at);
    gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), at);
    gain.gain.linearRampToValueAtTime(Math.max(0.0001, value), at + duration);
  }
  function tone({ frequency = 440, endFrequency = frequency, duration = 0.16, type = 'sine', volume = 0.12, bus = 'sfx', when, pan = 0 } = {}) {
    const ctx = ensureContext();
    if (!ctx || !buses[bus]) return;
    const start = when ?? ctx.currentTime, oscillator = ctx.createOscillator(), gain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(20, frequency), start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + Math.min(0.025, duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    if (panner) { panner.pan.value = clamp(pan, -1, 1); gain.connect(panner); panner.connect(buses[bus]); }
    else gain.connect(buses[bus]);
    oscillator.start(start); oscillator.stop(start + duration + 0.015);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); panner?.disconnect(); };
  }
  function noiseBed({ frequency = 420, q = 0.45, volume = 0.012, wave = 'sawtooth' } = {}) {
    const ctx = ensureContext();
    if (!ctx) return null;
    const oscillator = ctx.createOscillator(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
    oscillator.type = wave; oscillator.frequency.value = frequency;
    filter.type = 'lowpass'; filter.frequency.value = frequency * 2.2; filter.Q.value = q;
    gain.gain.value = volume;
    oscillator.connect(filter); filter.connect(gain); gain.connect(buses.ambience); oscillator.start();
    return { oscillator, filter, gain, extras: [] };
  }
  function stopAmbience() {
    for (const node of ambienceNodes) {
      try { node.oscillator.stop(); } catch { /* already stopped */ }
      node.extras.forEach((extra) => { try { extra.stop?.(); } catch { /* already stopped */ } extra.disconnect?.(); });
      node.oscillator.disconnect(); node.filter.disconnect(); node.gain.disconnect();
    }
    ambienceNodes = [];
  }
  function chimeLoop() {
    if (chimeTimer) clearTimeout(chimeTimer);
    if (!unlocked || !AUDIO_MANIFEST.chapters[chapter]?.ambience.includes('chimes')) return;
    tone({ frequency: 1046, endFrequency: 1040, duration: 1.3, volume: 0.014, bus: 'ambience' });
    chimeTimer = setTimeout(() => { if (unlocked) chimeLoop(); }, 7200 + Math.random() * 5200);
  }
  function startAmbience() {
    if (!unlocked || !context) return;
    stopAmbience();
    const layers = AUDIO_MANIFEST.chapters[chapter]?.ambience ?? [];
    for (const layer of layers) {
      if (layer === 'wind') ambienceNodes.push(noiseBed({ frequency: 170, volume: 0.009, wave: 'triangle' }));
      if (layer === 'waves') {
        const wave = noiseBed({ frequency: 82, volume: 0.013, wave: 'sine' });
        if (wave) {
          const lfo = context.createOscillator(), depth = context.createGain();
          lfo.frequency.value = 0.13; depth.gain.value = 28; lfo.connect(depth); depth.connect(wave.filter.frequency); lfo.start(); wave.extras.push(lfo, depth);
        }
        ambienceNodes.push(wave);
      }
      if (layer === 'clock') ambienceNodes.push(noiseBed({ frequency: 880, volume: 0.002, wave: 'square' }));
    }
    ambienceNodes = ambienceNodes.filter(Boolean);
    chimeLoop();
  }
  function stopMusic() {
    for (const layer of musicLayers) {
      try { layer.audio.pause(); } catch { /* no-op */ }
      layer.audio.removeAttribute?.('src'); layer.audio.load?.();
      layer.gain.disconnect(); layer.source.disconnect();
    }
    musicLayers = [];
  }
  function beatTime() {
    const beat = 60 / (AUDIO_MANIFEST.chapters[chapter]?.bpm ?? 72), now = context.currentTime;
    return now + (beat - ((now % beat) + beat) % beat) + 0.06;
  }
  function startMusic(nextChapter = chapter) {
    if (!unlocked || !context) return;
    chapter = nextChapter;
    const ctx = context, targetTime = beatTime(), oldLayers = [...musicLayers];
    const scene = AUDIO_MANIFEST.chapters[chapter] ?? AUDIO_MANIFEST.chapters['chapter-01'];
    const nextLayers = [];
    for (const name of ['base', 'tension', 'boss']) {
      const audio = createAudio(); audio.src = scene[name]; audio.preload = name === 'base' ? 'auto' : 'none'; audio.loop = true;
      const source = ctx.createMediaElementSource(audio), gain = ctx.createGain(); gain.gain.value = 0.0001;
      source.connect(gain); gain.connect(buses.music); nextLayers.push({ name, audio, source, gain });
    }
    musicLayers = nextLayers;
    Promise.resolve().then(async () => {
      for (const layer of nextLayers) {
        try { if (layer.name !== 'base') layer.audio.preload = 'auto'; await layer.audio.play(); } catch { /* licensed tracks are optional until supplied */ }
      }
      nextLayers.forEach((layer) => setGain(layer.gain, layer.name === 'base' ? (intensity === 'base' ? 0.72 : 0.52) : layer.name === intensity ? 0.56 : 0, targetTime, 1.4));
      oldLayers.forEach((layer) => {
        setGain(layer.gain, 0, targetTime, 1.4);
        setTimeout(() => { try { layer.audio.pause(); layer.audio.removeAttribute?.('src'); layer.audio.load?.(); layer.source.disconnect(); layer.gain.disconnect(); } catch { /* disposed */ } }, Math.max(0, (targetTime - ctx.currentTime + 1.45) * 1000));
      });
    });
  }
  function updateIntensity(next) {
    intensity = ['base', 'tension', 'boss'].includes(next) ? next : 'base';
    if (!context) return;
    const at = beatTime();
    for (const layer of musicLayers) setGain(layer.gain, layer.name === 'base' ? (intensity === 'base' ? 0.72 : 0.52) : layer.name === intensity ? 0.56 : 0, at, 0.9);
  }
  async function unlock() {
    const ctx = ensureContext();
    if (!ctx) return false;
    try { await ctx.resume(); } catch { return false; }
    if (!unlocked) { unlocked = true; startMusic(chapter); startAmbience(); }
    return true;
  }
  function setBusLevel(name, level) {
    if (!settings[name]) return;
    settings[name].level = clamp(level);
    const gain = name === 'master' ? master : buses[name];
    if (gain && context) setGain(gain, settings[name].muted ? 0 : settings[name].level, context.currentTime, 0.06);
  }
  function setBusMuted(name, muted) {
    if (!settings[name]) return;
    settings[name].muted = Boolean(muted);
    const gain = name === 'master' ? master : buses[name];
    if (gain && context) setGain(gain, settings[name].muted ? 0 : settings[name].level, context.currentTime, 0.06);
  }
  function setChapter(next) {
    if (!AUDIO_MANIFEST.chapters[next] || next === chapter) return;
    chapter = next;
    if (unlocked) { startMusic(next); startAmbience(); }
  }
  function setDialogue(active) {
    dialogueActive = Boolean(active);
    if (buses.music && context) setGain(buses.music, dialogueActive ? 0.42 : 1, context.currentTime, dialogueActive ? 0.12 : 0.55);
  }
  function playUI(kind = 'press') {
    const presets = {
      hover: { frequency: 760, endFrequency: 820, duration: 0.055, volume: 0.025 },
      press: { frequency: 390, endFrequency: 320, duration: 0.07, volume: 0.055 },
      confirm: { frequency: 540, endFrequency: 920, duration: 0.22, volume: 0.07 },
      back: { frequency: 420, endFrequency: 270, duration: 0.14, volume: 0.045 },
    };
    tone({ ...(presets[kind] ?? presets.press), bus: 'ui' });
  }
  function playSfx(kind, { x = 0, listenerX = 0, surface = 'stone' } = {}) {
    const distance = Math.abs(Number(x) - Number(listenerX)), falloff = 1 / (1 + distance * distance * 0.035);
    const pan = clamp((Number(x) - Number(listenerX)) / 12, -1, 1);
    if (kind === 'jump') tone({ frequency: 320, endFrequency: 510, duration: 0.14, volume: 0.12 * falloff, pan });
    else if (kind === 'land') tone({ frequency: surface === 'moss' ? 115 : surface === 'wood' ? 150 : surface === 'crystal' ? 620 : 90, endFrequency: 55, duration: 0.1, type: 'triangle', volume: 0.1 * falloff, pan });
    else if (kind === 'footstep') tone({ frequency: surface === 'moss' ? 185 : surface === 'wood' ? 210 : surface === 'crystal' ? 540 : 125, endFrequency: 75, duration: 0.055, type: 'triangle', volume: 0.04 * falloff, pan });
    else if (kind === 'collect') {
      const now = performance.now(); collectCombo = now - lastCollectAt < 1500 ? Math.min(8, collectCombo + 1) : 0; lastCollectAt = now;
      tone({ frequency: 680 + collectCombo * 95, endFrequency: 1180 + collectCombo * 75, duration: 0.28, volume: 0.1 * falloff, pan });
      tone({ frequency: 1040 + collectCombo * 80, endFrequency: 1480 + collectCombo * 80, duration: 0.4, volume: 0.035 * falloff, when: (context?.currentTime ?? 0) + 0.075, pan });
    } else if (kind === 'pulse') tone({ frequency: 210, endFrequency: 760, duration: 0.28, volume: 0.1 * falloff, pan });
    else if (kind === 'checkpoint') {
      tone({ frequency: 510, endFrequency: 790, duration: 0.22, volume: 0.08 * falloff, pan });
      tone({ frequency: 790, endFrequency: 1040, duration: 0.32, volume: 0.055 * falloff, when: (context?.currentTime ?? 0) + 0.11, pan });
    } else if (kind === 'heartbeat') {
      const at = context?.currentTime ?? 0;
      tone({ frequency: 74, endFrequency: 62, duration: 0.13, type: 'sine', volume: 0.12 * falloff, bus: 'ambience', when: at, pan });
      tone({ frequency: 66, endFrequency: 54, duration: 0.16, type: 'sine', volume: 0.095 * falloff, bus: 'ambience', when: at + 0.2, pan });
    } else if (kind === 'dialogue') {
      tone({ frequency: 480, endFrequency: 620, duration: 0.2, volume: 0.03, bus: 'ui' });
      playSfx('heartbeat', { x, listenerX });
    }
  }
  function getSettings() { return Object.fromEntries(Object.entries(settings).map(([name, value]) => [name, { ...value }])); }
  function destroy() {
    unlocked = false; if (chimeTimer) clearTimeout(chimeTimer);
    stopMusic(); stopAmbience();
    if (context && context.state !== 'closed') context.close();
    context = null; master = null; buses = {};
  }
  return { unlock, setBusLevel, setBusMuted, getSettings, setChapter, setDialogue, setIntensity, playUI, playSfx, destroy, isUnlocked: () => unlocked };
}
