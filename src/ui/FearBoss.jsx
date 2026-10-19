import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './FearBoss.module.css';

const PHASES = [
  { title: 'Learn the Patterns', subtitle: 'Fear is trying to protect you. Watch the light before you answer.', duration: 78, music: 'A low heartbeat, a single warm note.' },
  { title: 'The Dark That Gathers', subtitle: 'The room grows smaller. Light the lanterns, and give the shadows room to pass.', duration: 105, music: 'A quiet pulse beneath distant strings.' },
  { title: 'Reach', subtitle: 'You do not need to defeat him. Stay close, and let him feel the light.', duration: 90, music: 'A slow, rising harmonic held in the air.' },
];
const PATTERN_COUNT = 6;
const LANTERN_COUNT = 5;

export function FearBoss({ onExit }) {
  const [screen, setScreen] = useState('intro');
  const [phase, setPhase] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [pattern, setPattern] = useState(0);
  const [absorbed, setAbsorbed] = useState([]);
  const [lanterns, setLanterns] = useState([]);
  const [lane, setLane] = useState(1);
  const [comfort, setComfort] = useState(0);
  const [holding, setHolding] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [hitStop, setHitStop] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [checkpoint, setCheckpoint] = useState(0);
  const audioRef = useRef(null);
  const phaseRef = useRef(phase);
  const phaseTime = PHASES[phase]?.duration ?? 0;
  const currentPattern = pattern % PATTERN_COUNT;
  const tellWindow = elapsed % 11;
  const tellActive = tellWindow < 0.8;
  const projectileActive = tellWindow >= 0.8 && tellWindow < 3.2;
  const darkLevel = phase === 1 ? Math.min(0.78, 0.12 + elapsed / phaseTime * 0.66) : 0;
  const calm = phase === 0
    ? Math.round(absorbed.length / PATTERN_COUNT * 34)
    : phase === 1
      ? 34 + Math.round(lanterns.length / LANTERN_COUNT * 38)
      : 72 + Math.round(comfort / 90 * 28);

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    if (screen !== 'play' || phase > 2) return undefined;
    const timer = window.setInterval(() => setElapsed((value) => value + 0.1), 100);
    return () => window.clearInterval(timer);
  }, [screen, phase]);

  useEffect(() => {
    if (screen !== 'play' || phase !== 2 || !holding) return undefined;
    const timer = window.setInterval(() => setComfort((value) => Math.min(90, value + 0.1)), 100);
    return () => window.clearInterval(timer);
  }, [screen, phase, holding]);

  useEffect(() => {
    if (!soundOn || screen !== 'play' || phase > 2) return undefined;
    let context;
    let oscillators = [];
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return undefined;
      context = new AudioContextClass();
      audioRef.current = context;
      const master = context.createGain();
      master.gain.value = 0.018;
      master.connect(context.destination);
      const frequencies = phase === 0 ? [55, 82.4] : phase === 1 ? [65.4, 98, 146.8] : [110, 164.8, 220];
      frequencies.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index === 0 ? 'sine' : 'triangle';
        oscillator.frequency.value = frequency;
        gain.gain.value = index === 0 ? 0.7 : 0.22;
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start();
        oscillators.push(oscillator);
      });
    } catch {
      // Sound is an enhancement; every mechanic remains visual and playable without it.
    }
    return () => {
      oscillators.forEach((oscillator) => { try { oscillator.stop(); } catch { /* already stopped */ } });
      if (context && context.state !== 'closed') context.close();
      audioRef.current = null;
    };
  }, [soundOn, screen, phase]);

  useEffect(() => {
    if (phase === 0 && screen === 'play' && elapsed >= PHASES[0].duration && absorbed.length === PATTERN_COUNT) {
      setCheckpoint(1);
      setScreen('checkpoint');
    }
    if (phase === 1 && screen === 'play' && elapsed >= PHASES[1].duration && lanterns.length === LANTERN_COUNT) {
      setCheckpoint(2);
      setScreen('checkpoint');
    }
    if (phase === 2 && screen === 'play' && comfort >= 90) {
      setScreen('ending');
    }
  }, [absorbed.length, comfort, elapsed, lanterns.length, phase, screen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (screen !== 'play') return;
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') { event.preventDefault(); setLane((value) => Math.max(0, value - 1)); }
      if (event.code === 'ArrowRight' || event.code === 'KeyD') { event.preventDefault(); setLane((value) => Math.min(2, value + 1)); }
      if ((event.code === 'Space' || event.code === 'ShiftLeft') && phase === 0) { event.preventDefault(); absorbPulse(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const startPhase = useCallback((nextPhase) => {
    setPhase(nextPhase);
    setElapsed(0);
    setScreen('play');
    setHolding(false);
    setPulse(false);
  }, []);

  const absorbPulse = useCallback(() => {
    if (screen !== 'play' || phase !== 0) return;
    const now = elapsed % 11;
    if (now < 0.8 || (now >= 0.8 && now < 3.2)) {
      setAbsorbed((items) => {
        if (items.includes(currentPattern)) return items;
        return [...items, currentPattern];
      });
      setPattern((value) => value + 1);
      setPulse(true);
      setHitStop(true);
      window.setTimeout(() => setPulse(false), 360);
      window.setTimeout(() => setHitStop(false), 90);
    } else {
      setPulse(true);
      window.setTimeout(() => setPulse(false), 180);
    }
  }, [currentPattern, elapsed, phase, screen]);

  const lightLantern = (index) => {
    if (lanterns.includes(index)) return;
    setLanterns((items) => [...items, index]);
    setHitStop(true);
    window.setTimeout(() => setHitStop(false), 90);
  };

  const resumeCheckpoint = () => startPhase(checkpoint === 1 ? 1 : 2);
  const remaining = Math.max(0, Math.ceil(phaseTime - elapsed));

  if (screen === 'intro') {
    return (
      <section className={styles.panel} aria-label="Fear boss introduction">
        <div className={styles.titleCard}>
          <p className={styles.kicker}>A LITTLE MORE LIGHT · FINAL ENCOUNTER</p>
          <div className={styles.titleOrb} aria-hidden="true"><span /></div>
          <p className={styles.overline}>THE THING WE CARRY</p>
          <h2>FEAR</h2>
          <p className={styles.introCopy}>A three-part encounter about understanding, making room, and staying.</p>
          <p className={styles.quietCopy}>You cannot kill Fear here. You can listen to him.</p>
          <button className={styles.primary} type="button" onClick={() => startPhase(0)}>Enter the quiet</button>
          <button className={styles.secondary} type="button" onClick={onExit}>Return to chapters</button>
        </div>
      </section>
    );
  }

  if (screen === 'checkpoint') {
    return (
      <section className={styles.panel} aria-label="Phase checkpoint">
        <div className={styles.checkpoint}>
          <div className={styles.smallOrb} aria-hidden="true">✦</div>
          <p className={styles.kicker}>CHECKPOINT {checkpoint} · PROGRESS KEPT</p>
          <h2>{checkpoint === 1 ? 'You learned his language.' : 'You made room for the light.'}</h2>
          <p>{checkpoint === 1 ? 'The projectiles are not attacks anymore. They are feelings arriving before words.' : 'The lanterns hold their glow. The dark is still here, but it is no longer the whole room.'}</p>
          <div className={styles.checkpointStats}><span>{absorbed.length}/{PATTERN_COUNT} patterns understood</span><span>{lanterns.length}/{LANTERN_COUNT} lanterns lit</span></div>
          <button className={styles.primary} type="button" onClick={resumeCheckpoint}>{checkpoint === 1 ? 'Enter the dark' : 'Reach for him'}</button>
          <button className={styles.secondary} type="button" onClick={onExit}>Leave at checkpoint</button>
        </div>
      </section>
    );
  }

  if (screen === 'ending') {
    return (
      <section className={styles.panel} aria-label="Fear comforted ending">
        <div className={styles.ending}>
          <div className={styles.heldLight} aria-hidden="true"><i /><b /></div>
          <p className={styles.kicker}>NOT DEFEATED · UNDERSTOOD</p>
          <h2>He is still here.</h2>
          <p>Fear becomes a small, trembling light. She cups her hands around him, and for the first time, he does not have to shine alone.</p>
          <p className={styles.endingWhisper}>“You were trying to keep me safe. You can rest now.”</p>
          <button className={styles.primary} type="button" onClick={onExit}>Carry the light onward</button>
          <button className={styles.secondary} type="button" onClick={() => { setAbsorbed([]); setLanterns([]); setComfort(0); setPattern(0); setCheckpoint(0); startPhase(0); }}>Begin again</button>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.panel} ${styles['phase' + (phase + 1)]} ${hitStop ? styles.hitStop : ''}`} aria-label={`Fear boss phase ${phase + 1}: ${PHASES[phase].title}`}>
      <header className={styles.hud}>
        <div><p className={styles.kicker}>FINAL ENCOUNTER · PHASE {phase + 1} / 3</p><h2>{PHASES[phase].title}</h2><p>{PHASES[phase].subtitle}</p></div>
        <button className={styles.soundToggle} type="button" onClick={() => setSoundOn((value) => !value)} aria-pressed={soundOn}>{soundOn ? '♫ Sound on' : 'Sound off'}</button>
      </header>
      <div className={styles.calmWrap} aria-label={`Calm level ${calm} percent`}>
        <div className={styles.calmLabels}><span>CALM LEVEL</span><span>{calm}%</span></div>
        <div className={styles.barTrack}><div className={styles.damageTrail} style={{ width: `${Math.max(0, calm - 5)}%` }} /><div className={styles.calmFill} style={{ width: `${calm}%` }} /></div>
      </div>
      <div className={styles.arena} style={{ '--darkness': darkLevel, '--hero-lane': lane }}>
        <div className={styles.moon} />
        <div className={styles.arenaRim} />
        {phase === 1 && <div className={styles.closingDark} aria-hidden="true" />}
        <div className={styles.fearFigure} aria-label="Fear, a trembling shadow">
          <span className={styles.fearAura} /><span className={styles.fearHead} /><span className={styles.fearBody} /><span className={styles.fearCore} />
        </div>
        <div className={styles.heroine} aria-label="She, carrying the pulse"><span className={styles.heroHead} /><span className={styles.heroBody} /><span className={styles.heroLight} /></div>
        {phase === 0 && <div className={`${styles.projectile} ${tellActive ? styles.tell : ''} ${projectileActive ? styles.incoming : ''}`} aria-hidden="true"><span /></div>}
        {phase === 1 && Array.from({ length: LANTERN_COUNT }, (_, index) => (
          <button key={index} type="button" className={`${styles.lantern} ${lanterns.includes(index) ? styles.lit : ''}`} style={{ '--lantern-index': index }} onClick={() => lightLantern(index)} aria-label={`${lanterns.includes(index) ? 'Relight' : 'Light'} lantern ${index + 1}`} aria-pressed={lanterns.includes(index)}><span>✦</span></button>
        ))}
        {phase === 1 && <div className={styles.shadowSweep} style={{ '--shadow-lane': (Math.floor(elapsed / 5) % 3) }} aria-hidden="true" />}
        {phase === 2 && <div className={styles.reachThreads} aria-hidden="true"><i /><i /><i /></div>}
      </div>
      <div className={styles.playControls}>
        {phase === 0 && <>
          <div className={styles.patternStatus}><span className={tellActive ? styles.tellLabel : ''}>{tellActive ? 'TELL · READ THE LIGHT' : projectileActive ? 'PROJECTILE · PULSE TO ABSORB' : 'WATCH HIS BREATH'}</span><span>Pattern {Math.min(pattern + 1, PATTERN_COUNT)} / {PATTERN_COUNT}</span></div>
          <p className={styles.instruction}>Each tell lasts 0.8 seconds. Pulse during the tell or as the light travels toward you. Nothing hurts you.</p>
          <button className={`${styles.pulseButton} ${pulse ? styles.pulsing : ''}`} type="button" onClick={absorbPulse}>✧ Hold / tap Warm Light</button>
          <div className={styles.patternDots} aria-label={`${absorbed.length} of ${PATTERN_COUNT} patterns absorbed`}>{Array.from({ length: PATTERN_COUNT }, (_, index) => <span key={index} className={absorbed.includes(index) ? styles.dotDone : ''} />)}</div>
        </>}
        {phase === 1 && <>
          <div className={styles.patternStatus}><span>LIGHT THE ARENA</span><span>{lanterns.length} / {LANTERN_COUNT} lanterns</span></div>
          <p className={styles.instruction}>Tap each lantern. Use ← / → or A / D to shift between three safe paths while the shadow passes. A missed step never resets your progress.</p>
          <div className={styles.dodgeControls}><button className={styles.secondary} type="button" onClick={() => setLane((value) => Math.max(0, value - 1))} aria-label="Dodge left">← Shift left</button><span>Path {lane + 1} / 3</span><button className={styles.secondary} type="button" onClick={() => setLane((value) => Math.min(2, value + 1))} aria-label="Dodge right">Shift right →</button></div>
          <div className={styles.patternDots} aria-label={`${lanterns.length} of ${LANTERN_COUNT} lanterns lit`}>{Array.from({ length: LANTERN_COUNT }, (_, index) => <span key={index} className={lanterns.includes(index) ? styles.dotDone : ''} />)}</div>
        </>}
        {phase === 2 && <>
          <p className={styles.instruction}>Tap whenever you need a breath, or press and hold to keep the light steady. Holding is optional; tapping works too. There is no wrong rhythm.</p>
          <button className={`${styles.comfortButton} ${holding ? styles.comforting : ''}`} type="button" onPointerDown={(event) => { event.preventDefault(); setHolding(true); }} onPointerUp={() => setHolding(false)} onPointerLeave={() => setHolding(false)} onPointerCancel={() => setHolding(false)} onClick={() => setComfort((value) => Math.min(90, value + 0.6))} aria-label="Hold or tap to comfort Fear" aria-pressed={holding}>{holding ? 'Holding the light…' : 'Hold or tap to comfort'}</button>
          <div className={styles.comfortMeter}><div style={{ width: `${Math.min(100, comfort / 90 * 100)}%` }} /></div><p className={styles.comfortCaption}>No failure. Just stay as long as you need.</p>
        </>}
        <div className={styles.timeRow}><span>{PHASES[phase].music}</span><span>Time in phase {Math.floor(elapsed)}s · {remaining}s</span></div>
      </div>
    </section>
  );
}
