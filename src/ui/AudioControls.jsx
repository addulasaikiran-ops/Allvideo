import { useState } from 'react';
import styles from './GameShell.module.css';
const LABELS = { master: 'Master', music: 'Music', sfx: 'SFX', ui: 'UI', ambience: 'Ambience' };
export function AudioControls({ audio }) {
 const [settings, setSettings] = useState(() => audio.getSettings());
 const [expanded, setExpanded] = useState(false);
 const level = (name, value) => { audio.setBusLevel(name, value); setSettings(audio.getSettings()); };
 const mute = (name) => { audio.setBusMuted(name, !settings[name].muted); setSettings(audio.getSettings()); };
 return <section className={styles.audioPanel} aria-label="Audio settings"><div className={styles.audioPanelTop}><strong>Sound garden</strong><button type="button" onClick={() => setExpanded(v => !v)} aria-expanded={expanded}>{expanded ? 'Hide mixer' : 'Audio mixer'}</button>{!audio.isUnlocked() && <button type="button" onClick={() => audio.unlock().then(() => setUnlockedVersion(v => v + 1))}>Enable sound</button>}</div>{expanded && <div className={styles.audioMixer}>{Object.keys(LABELS).map(name => <label className={styles.audioBus} key={name}><span>{LABELS[name]}</span><input aria-label={LABELS[name] + ' volume'} type="range" min="0" max="1" step="0.01" value={settings[name].level} onChange={e => level(name, e.target.value)} /><button type="button" aria-pressed={settings[name].muted} onClick={() => mute(name)}>{settings[name].muted ? 'Muted' : 'Mute'}</button></label>)}<p>Music streams when tracks are installed; interface sounds are synthesized.</p></div>}</section>;
}
