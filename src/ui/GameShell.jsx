import { useEffect, useRef, useState } from 'react';
import { createGameEngine } from '../engine/game-engine.js';
import { createWorldScene } from '../engine/scene.js';
import { personalConfig } from '../story/personal.config.js';
import { MemoryLane } from './MemoryLane.jsx';
import { PLAYER_CONFIG_LIMITS } from '../engine/player/player.config.js';
import { useEngineStore } from './use-engine-store.js';
import styles from './GameShell.module.css';

export function GameShell() {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const [assistMode, setAssistMode] = useState(false);
  const [engine] = useState(() => createGameEngine({
    onFrame: (frame) => rendererRef.current?.render(frame),
  }));
  const [showHelp, setShowHelp] = useState(false);
  const [memoryLane, setMemoryLane] = useState(false);

  const selectChapter = (chapter) => {
    if (chapter === 'chapter-06') {
      setMemoryLane(true);
      return;
    }
    setMemoryLane(false);
    engine.loadChapter(chapter);
  };

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const world = createWorldScene(canvasRef.current);
    rendererRef.current = world;
    world.render({ player: engine.store.getState().player, deltaSeconds: 0 });
    return () => {
      rendererRef.current = null;
      world.destroy();
      engine.destroy();
    };
  }, [engine]);

  useEffect(() => {
    engine.setAssistMode(assistMode);
  }, [assistMode, engine]);

  useEffect(() => {
    const unsubscribe = engine.eventBus.on('puzzle:hint', () => {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const audio = new AudioContextClass();
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, audio.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audio.currentTime + 0.16);
        gain.gain.setValueAtTime(0.0001, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, audio.currentTime + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.28);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start();
        oscillator.stop(audio.currentTime + 0.3);
        oscillator.onended = () => audio.close();
      } catch {
        // The visual strand cue remains available if audio is unavailable or blocked.
      }
    });
    return unsubscribe;
  }, [engine]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code === 'F2') { event.preventDefault(); engine.togglePlayerDebug(); }
      if (event.code === 'F3') { event.preventDefault(); engine.toggleLevelDebug(); }
      if (event.code === 'F5') { event.preventDefault(); engine.hotReloadLevel(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [engine]);

  return (
    <GameSurface
      canvasRef={canvasRef}
      engine={engine}
      assistMode={assistMode}
      onAssistChange={setAssistMode}
      showHelp={showHelp}
      memoryLane={memoryLane}
      onSelectChapter={selectChapter}
      onToggleHelp={() => setShowHelp((visible) => !visible)}
    />
  );
}

function GameSurface({ canvasRef, engine, assistMode, onAssistChange, showHelp, memoryLane, onSelectChapter, onToggleHelp }) {
  const state = useEngineStore(engine.store);

  return (
    <main className={styles.shell}>
      <section className={styles.stage} aria-label="Game stage">
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          aria-label="A little more light: move with arrow keys or A and D, and jump with Space."
        />
        {memoryLane ? <MemoryLane onExit={() => onSelectChapter('chapter-05')} /> : <div className={styles.overlay}>
          <p className={styles.eyebrow}>{state.levelSnapshot?.title ? state.levelSnapshot.title.toUpperCase() : 'A LITTLE MORE LIGHT'}</p>
          <h1>{personalConfig.names.heroine} and {personalConfig.names.boyfriend}</h1>
          <p className={styles.message}>{personalConfig.messages.opening}</p>
          <p className={styles.status} role="status">
            {state.status === 'Playing' ? 'You are not alone.' : 'A gentle journey is waiting.'}
            {' '}Checkpoint: {state.checkpointId} · Health: {state.hp ?? 3}/5
          </p>
          <button className={styles.primaryButton} type="button" onClick={() => engine.start()}>
            {state.status === 'Playing' ? 'Journey started' : 'Begin gently'}
          </button>
          <div className={styles.controlRow} aria-label="Touch movement controls">
            <button
              className={styles.controlButton}
              type="button"
              aria-label="Move left"
              onPointerDown={() => engine.input.setTouchAxis(-1)}
              onPointerUp={() => engine.input.setTouchAxis(0)}
              onPointerLeave={() => engine.input.setTouchAxis(0)}
              onPointerCancel={() => engine.input.setTouchAxis(0)}
            >←</button>
            <button
              className={styles.controlButton}
              type="button"
              aria-label="Move right"
              onPointerDown={() => engine.input.setTouchAxis(1)}
              onPointerUp={() => engine.input.setTouchAxis(0)}
              onPointerLeave={() => engine.input.setTouchAxis(0)}
              onPointerCancel={() => engine.input.setTouchAxis(0)}
            >→</button>
            <button
              className={styles.jumpButton}
              type="button"
              aria-label="Jump"
              onPointerDown={() => engine.input.setTouchJump(true)}
              onPointerUp={() => engine.input.setTouchJump(false)}
              onPointerLeave={() => engine.input.setTouchJump(false)}
              onPointerCancel={() => engine.input.setTouchJump(false)}
            >Jump ✦</button>
            <button className={styles.controlButton} type="button" aria-label="Warm Light pulse" onPointerDown={() => engine.input.setTouchPulse(true)} onPointerUp={() => engine.input.setTouchPulse(false)} onPointerLeave={() => engine.input.setTouchPulse(false)} onPointerCancel={() => engine.input.setTouchPulse(false)}>✧</button>
          </div>
          {state.activeHint && state.status === 'Playing' && (
            <aside className={styles.contextHint} key={state.activeHint.skill} aria-live="polite">
              <span>{state.activeHint.text}</span><strong>{state.activeHint.input}</strong>
              {state.activeHint.visualCue && <span aria-label="Puzzle sequence cue">Strand: {state.activeHint.visualCue}</span>}
            </aside>
          )}
          {state.activeDialogue && (
            <aside className={styles.contextHint} aria-live="polite" aria-label="Message in a bottle dialogue">
              <strong>{state.activeDialogue.choices ? (state.activeDialogue.boss ? 'The giant mirror' : 'A thought in the glass') : 'Message in a bottle'}</strong>
              <p>{state.activeDialogue.lines[state.activeDialogue.index]}</p>
              {state.activeDialogue.boss && <p>Truths spoken kindly: {state.activeDialogue.cracks} / {state.activeDialogue.requiredTruths}. The mirror is listening; there is no rush.</p>}
              {state.activeDialogue.choices ? (
                <div className={styles.optionsRow}>
                  {state.activeDialogue.choices.map((choice) => (
                    <button className={styles.primaryButton} type="button" key={choice.id} onClick={() => engine.chooseDialogueChoice(state.activeDialogue.sourceId, choice.id)}>{choice.label}</button>
                  ))}
                  <button className={styles.secondaryButton} type="button" onClick={() => engine.skipDialogue()}>Not now</button>
                </div>
              ) : (
                <div className={styles.optionsRow}>
                  <button className={styles.primaryButton} type="button" onClick={() => engine.advanceDialogue()}>
                    {state.activeDialogue.index + 1 >= state.activeDialogue.lines.length ? 'Close message' : 'Next'}
                  </button>
                  {state.activeDialogue.skippable && <button className={styles.secondaryButton} type="button" onClick={() => engine.skipDialogue()}>Skip dialogue</button>}
                </div>
              )}
            </aside>
          )}
          <div className={styles.optionsRow}>
            <label className={styles.assistLabel}>
              Chapter
              <select value={memoryLane ? 'chapter-06' : state.chapter} onChange={(event) => onSelectChapter(event.target.value)} aria-label="Select chapter">
                <option value="chapter-01">1 · The Quiet Morning</option>
                <option value="chapter-02">2 · Tangle of Worries</option>
                <option value="chapter-03">3 · Sea of Distance</option>
                <option value="chapter-04">4 · Tower of Deadlines</option>
                <option value="chapter-05">5 · Mirror of Doubt</option>
                <option value="chapter-06">6 · Memory Lane</option>
              </select>
            </label>
            <label className={styles.assistLabel}>
              <input type="checkbox" checked={assistMode} onChange={(event) => onAssistChange(event.target.checked)} />
              Assist mode
            </label>
            <button className={styles.secondaryButton} type="button" onClick={() => engine.resetToCheckpoint()}>
              Return to checkpoint
            </button>
            <button className={styles.secondaryButton} type="button" onClick={() => engine.setFeelTestRoom(!state.feelTestRoom)}>
              {state.feelTestRoom ? 'Exit feel test' : 'Feel test room'}
            </button>
            <button className={styles.secondaryButton} type="button" onClick={() => engine.toggleLevelDebug()} aria-expanded={state.levelDebug}>
              {state.levelDebug ? 'Hide level debug (F3)' : 'Level debug (F3)'}
            </button>
            <button className={styles.secondaryButton} type="button" onClick={() => engine.hotReloadLevel()}>Reload level (F5)</button>
            <button className={styles.secondaryButton} type="button" onClick={() => engine.togglePlayerDebug()} aria-expanded={state.playerDebug}>
              {state.playerDebug ? 'Hide tuning (F2)' : 'Tune feel (F2)'}
            </button>
            <button className={styles.secondaryButton} type="button" onClick={onToggleHelp} aria-expanded={showHelp}>
              {showHelp ? 'Hide help' : 'Controls'}
            </button>
          </div>
          {state.playerDebug && (
            <aside className={styles.debugPanel} aria-label="Live player feel tuning">
              <div className={styles.debugHeading}>
                <strong>Player feel · live tuning</strong>
                <button className={styles.secondaryButton} type="button" onClick={() => engine.resetPlayerTuning()}>Reset defaults</button>
              </div>
              {[
                ['moveSpeed', 'Move speed'], ['groundAcceleration', 'Ground acceleration'], ['airAcceleration', 'Air acceleration'],
                ['groundFriction', 'Ground friction'], ['jumpVelocity', 'Jump height'], ['doubleJumpVelocity', 'Double jump'],
                ['gravity', 'Gravity'], ['fallGravityMultiplier', 'Fall gravity'], ['coyoteTime', 'Coyote time'],
                ['jumpBufferTime', 'Jump buffer'], ['apexHangTime', 'Apex hang'], ['pulseRadius', 'Warm Light radius'],
                ['pulseCooldown', 'Pulse cooldown'], ['landingSquash', 'Landing squash'], ['respawnDuration', 'Respawn time'],
              ].map(([key, label]) => {
                const limits = PLAYER_CONFIG_LIMITS[key];
                return (
                  <label className={styles.tuningRow} key={key}>
                    <span>{label}</span>
                    <input type="range" min={limits[0]} max={limits[1]} step={['coyoteTime', 'jumpBufferTime', 'apexHangTime', 'pulseCooldown', 'respawnDuration'].includes(key) ? 0.01 : 0.05}
                      value={state.playerTuning[key]} onChange={(event) => engine.setPlayerTuning(key, event.target.value)} />
                    <output>{Number(state.playerTuning[key]).toFixed(2)}</output>
                  </label>
                );
              })}
              <p>Changes apply immediately. Shift: Warm Light · E/Enter: interact · R: rest · V: victory pose.</p>
            </aside>
          )}
          {state.levelDebug && (
            <aside className={styles.levelDebugPanel} aria-label="Level debug overlay">
              <strong>LEVEL DEBUG · {state.levelSnapshot?.title ?? 'Loading level'}</strong>
              <span>FPS {Math.round(state.fps ?? 0)} · Checkpoint {state.checkpointId}</span>
              <span>Entities {state.levelSnapshot?.entities?.length ?? 0} · Platforms {state.levelSnapshot?.entities?.filter((entity) => entity.type?.includes('platform')).length ?? 0}</span>
              <div className={styles.colliderList}>{(state.levelSnapshot?.entities ?? []).filter((entity) => entity.width && entity.height).map((entity) => (
                <span key={entity.id}>{entity.id} [{entity.type}] x:{entity.x.toFixed(1)} y:{entity.y.toFixed(1)} {entity.active ? '' : 'inactive'}</span>
              ))}</div>
            </aside>
          )}
          {showHelp && (
            <aside className={styles.help} aria-label="Controls and accessibility">
              <p><strong>Keyboard:</strong> Arrow keys or A/D move; Space, W, or Up jump; Shift Warm Light; E/Enter interact; R rest; V victory.</p>
              <p><strong>Gamepad:</strong> Left stick to move; primary face button to jump.</p>
              <p><strong>Touch:</strong> Hold the arrows to move and Jump to leap. Assist mode increases jump height.</p>
              <p><strong>Gentle play:</strong> Falling returns you to the last checkpoint. No lives or progress are lost.</p>
            </aside>
          )}
        </div>}
      </section>
      <footer className={styles.footer}>
        <span>Every step can be a small one.</span>
        <span>Elapsed: {Math.floor(state.elapsedSeconds)}s</span>
      </footer>
    </main>
  );
}
