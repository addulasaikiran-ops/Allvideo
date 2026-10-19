import { useState } from 'react';
import { COMPANION_STATES, COMPANION_PRESENCE } from '../story/personal.config.js';
import styles from './CompanionPresence.module.css';

function resolveState(chapter, hearts) {
  if (COMPANION_STATES[chapter]?.state) return COMPANION_STATES[chapter].state;
  if (hearts >= 8) return 'smiling';
  if (hearts >= 5) return 'hopeful';
  if (hearts >= 3) return 'tired';
  if (hearts >= 1) return 'looking-away';
  return 'curled-up';
}

export function CompanionPresence({ chapter, hearts = 0 }) {
  const [holding, setHolding] = useState(false);
  const [echoIndex, setEchoIndex] = useState(-1);
  const data = COMPANION_STATES[chapter] ?? COMPANION_STATES.default;
  const cue = COMPANION_PRESENCE[chapter] ?? COMPANION_PRESENCE.default;
  const state = resolveState(chapter, hearts);
  const lines = data.lines?.length ? data.lines : COMPANION_STATES.default.lines;
  const progress = Math.min(100, Math.max(0, Number(hearts) * 10));
  const coOp = chapter === 'chapter-06' || chapter === 'chapter-08';
  return <aside className={styles.presence} aria-label="Companion connection">
    <div className={styles.meterHead}><strong>Connection</strong><span>{Math.max(0, Number(hearts) || 0)} hearts</span></div>
    <div className={styles.meter} role="progressbar" aria-label="Connection from collected hearts" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><span style={{ width: progress + '%' }} /></div>
    <div className={styles.row}>
      <div className={[styles.silhouette, styles[state], holding ? styles.held : ''].join(' ')} aria-hidden="true"><i className={styles.head}/><i className={styles.body}/><i className={styles.scarf}/><i className={styles.arm}/></div>
      <div className={styles.copy}><strong>{data.label ?? state.replaceAll('-', ' ')}</strong><span className={styles.cue}><i>{cue.icon ?? '✦'}</i> {cue.label}</span>
        <button className={styles.echoButton} onClick={() => setEchoIndex((i) => (i + 1) % lines.length)} type="button">Hear his echo</button>
      </div>
    </div>
    {echoIndex >= 0 && <div className={styles.echo} role="status">“{lines[echoIndex]}”<button type="button" onClick={() => setEchoIndex(-1)} aria-label="Dismiss echo">×</button></div>}
    {coOp && <div className={[styles.coop, holding ? styles.active : ''].join(' ')}><div className={styles.tether} aria-hidden="true"><i/><i/></div><div><strong>{holding ? 'Together, at your pace' : 'A moment to connect'}</strong><span>{holding ? 'The gentle tether yields as you move.' : 'Hold hands to move in step.'}</span></div><button type="button" aria-pressed={holding} onClick={() => setHolding((v) => !v)}>{holding ? 'Release hands' : 'Hold hands'}</button></div>}
    <span className={styles.srOnly}>Collected hearts show progress, not a relationship-health score. Companion state: {state}.</span>
  </aside>;
}
