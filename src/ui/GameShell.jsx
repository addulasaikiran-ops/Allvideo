import { useEffect, useRef, useState } from 'react';
import { createGameEngine } from '../engine/game-engine.js';
import { personalConfig } from '../story/personal.config.js';
import { useEngineStore } from './use-engine-store.js';
import styles from './GameShell.module.css';

export function GameShell() {
  const canvasRef = useRef(null);
  const [engine, setEngine] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const gameEngine = createGameEngine();
    setEngine(gameEngine);
    return () => gameEngine.destroy();
  }, []);

  return (
    <GameSurface
      canvasRef={canvasRef}
      engine={engine}
      showHelp={showHelp}
      onToggleHelp={() => setShowHelp((visible) => !visible)}
    />
  );
}

function GameSurface({ canvasRef, engine, showHelp, onToggleHelp }) {
  const state = useEngineStore(engine?.store ?? emptyStore);

  return (
    <main className={styles.shell}>
      <section className={styles.stage} aria-label="Game stage">
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          aria-label="Allvideo game world. Use the game controls below to begin."
        />
        <div className={styles.overlay}>
          <p className={styles.eyebrow}>A LITTLE MORE LIGHT</p>
          <h1>{personalConfig.names.heroine} and {personalConfig.names.boyfriend}</h1>
          <p className={styles.message}>{personalConfig.messages.opening}</p>
          <p className={styles.status} role="status">Journey status: {state.status}</p>
          <button className={styles.primaryButton} type="button" onClick={() => engine?.start()}>
            Begin gently
          </button>
          <button className={styles.secondaryButton} type="button" onClick={onToggleHelp} aria-expanded={showHelp}>
            {showHelp ? 'Hide controls' : 'Controls and accessibility'}
          </button>
          {showHelp && (
            <aside className={styles.help} aria-label="Controls and accessibility">
              <p><strong>Keyboard:</strong> Arrow keys or A/D to move; Space to jump (gameplay controls arrive with the first playable level).</p>
              <p><strong>Accessibility:</strong> Assist mode and reduced-motion settings will be added before the first complete level.</p>
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

const emptyStore = {
  getState: () => ({ status: 'ready', elapsedSeconds: 0, checkpointId: 'start', assistMode: false }),
  subscribe: () => () => {},
};
