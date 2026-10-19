import { useEffect, useRef, useState } from 'react';
import { createGameEngine } from '../engine/game-engine.js';
import { createWorldScene } from '../engine/scene.js';
import { personalConfig } from '../story/personal.config.js';
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
      onToggleHelp={() => setShowHelp((visible) => !visible)}
    />
  );
}

function GameSurface({ canvasRef, engine, assistMode, onAssistChange, showHelp, onToggleHelp }) {
  const state = useEngineStore(engine.store);

  return (
    <main className={styles.shell}>
      <section className={styles.stage} aria-label="Game stage">
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          aria-label="A little more light: move with arrow keys or A and D, and jump with Space."
        />
        <div className={styles.overlay}>
          <p className={styles.eyebrow}>CHAPTER ONE · THE QUIET MEADOW</p>
          <h1>{personalConfig.names.heroine} and {personalConfig.names.boyfriend}</h1>
          <p className={styles.message}>{personalConfig.messages.opening}</p>
          <p className={styles.status} role="status">
            {state.status === 'Playing' ? 'You are not alone.' : 'A gentle journey is waiting.'}
            {' '}Checkpoint: {state.checkpointId}
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
          </div>
          {state.activeHint && state.status === 'Playing' && (
            <aside className={styles.contextHint} key={state.activeHint.skill} aria-live="polite">
              <span>{state.activeHint.text}</span><strong>{state.activeHint.input}</strong>
            </aside>
          )}
          <div className={styles.optionsRow}>
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
        </div>
      </section>
      <footer className={styles.footer}>
        <span>Every step can be a small one.</span>
        <span>Elapsed: {Math.floor(state.elapsedSeconds)}s</span>
      </footer>
    </main>
  );
}
