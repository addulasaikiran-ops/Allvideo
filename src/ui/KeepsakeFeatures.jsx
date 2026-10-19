import { useEffect, useMemo, useState } from 'react';
import { personalConfig } from '../story/personal.config.js';
import styles from './GameShell.module.css';

const STORE_KEY = 'allvideo.keepsakes.v1';
function readSave() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { return {}; }
}
function writeSave(value) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(value)); } catch { /* Saving is optional in private browsing. */ }
}

export function KeepsakeFeatures({ hearts, chapter, onPhotoMode, photoMode, photoHud, onPhotoHud, photoFilter, onPhotoFilter, onSetPhotoCamera, onNewGamePlus }) {
  const [save, setSave] = useState(readSave);
  const [open, setOpen] = useState(false);
  const [letter, setLetter] = useState('');
  const [egg, setEgg] = useState('');
  const [eggInput, setEggInput] = useState('');
  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(6);
  const [zoom, setZoom] = useState(1);
  const [secretOpen, setSecretOpen] = useState(false);
  const letters = useMemo(() => personalConfig.dailyLetters || [], []);
  const cosmetics = personalConfig.collectibles?.cosmeticUnlocks || [];
  const fragments = save.memoryFragments || [];
  const achievements = useMemo(() => [
    { id: 'first-heart', title: 'Pocketful of Warmth', detail: 'Find your first heart.', done: hearts >= 1, icon: '♡' },
    { id: 'heart-garden', title: 'A Small Garden', detail: 'Gather five hearts.', done: hearts >= 5, icon: '✿' },
    { id: 'chapter-wanderer', title: 'Gentle Wanderer', detail: 'Visit a chapter.', done: Boolean(chapter), icon: '✦' },
    { id: 'memory-keeper', title: 'Keeper of Fragments', detail: 'Find all memory fragments.', done: fragments.length >= (personalConfig.collectibles?.memoryFragmentsRequired || 8), icon: '◇' },
  ], [hearts, chapter, fragments.length]);
  useEffect(() => {
    const current = readSave();
    if (letters.length) {
      const index = Number.isInteger(current.letterIndex) ? (current.letterIndex + 1) % letters.length : 0;
      current.letterIndex = index;
      current.lastOpen = new Date().toISOString();
      writeSave(current);
      setSave(current);
      setLetter(letters[index]);
    }
  }, [letters]);
  useEffect(() => {
    const onKey = (event) => {
      if (event.key.toLowerCase() === 'p' && !event.target.matches('input,textarea,select')) {
        setOpen((value) => !value);
      }
      if (event.key.toLowerCase() === 'k' && !event.target.matches('input,textarea,select')) {
        const current = readSave();
        current.memoryFragments = [...new Set([...(current.memoryFragments || []), ...Array.from({ length: personalConfig.collectibles?.memoryFragmentsRequired || 8 }, (_, i) => 'fragment-' + (i + 1))])];
        writeSave(current); setSave(current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const unlockSecret = fragments.length >= (personalConfig.collectibles?.memoryFragmentsRequired || 8);
  const updateCamera = (next) => {
    const camera = { x: Number(next.x ?? cameraX), y: Number(next.y ?? cameraY), zoom: Number(next.zoom ?? zoom) };
    onSetPhotoCamera(camera);
  };
  const saveFragment = () => {
    const next = { ...save, memoryFragments: [...new Set([...fragments, 'fragment-' + (fragments.length + 1)])] };
    writeSave(next); setSave(next);
  };
  const checkEgg = (value) => {
    const match = (personalConfig.easterEggs || []).find((item) => item.trigger.toLowerCase() === value.trim().toLowerCase());
    setEgg(match ? (match.message || 'You found a little secret.') + (personalConfig.personalization?.insideJoke || '') : '');
  };
  const exportPng = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    try {
      const link = document.createElement('a');
      link.download = 'a-little-more-light-photo.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch { setEgg('This browser could not export the canvas. Try another browser or allow image export.'); }
  };
  return <section className={styles.keepsakePanel} aria-label="Keepsakes and extras">
    <div className={styles.keepsakeGrid}><button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open}>{open ? 'Close keepsakes' : 'Keepsakes & extras'} (P)</button><button type="button" onClick={saveFragment}>Find a memory fragment ◇</button><span className={styles.keepsakeSmall}>{fragments.length}/{personalConfig.collectibles?.memoryFragmentsRequired || 8} fragments</span></div>
    {letter && <aside><h3>✉ Daily letter</h3><p>{letter}</p></aside>}
    {open && <>
      <div><h3>Kind achievements</h3>{achievements.map(item => <p key={item.id}>{item.done ? '✓' : '○'} {item.icon} <strong>{item.title}</strong> — {item.detail}</p>)}</div>
      <div><h3>Heart-unlocked keepsakes</h3><div className={styles.keepsakeGrid}>{cosmetics.map(item => <button key={item.id} type="button" disabled={hearts < item.hearts} onClick={() => { const next = { ...save, equippedCosmetic: item.id }; writeSave(next); setSave(next); }}>{hearts >= item.hearts ? '♡ ' : '🔒 '}{item.label} · {item.hearts} hearts</button>)}</div><p className={styles.keepsakeSmall}>Equipped: {cosmetics.find(item => item.id === save.equippedCosmetic)?.label || 'default look'}</p></div>
      <div><h3>Photo mode</h3><div className={styles.keepsakeGrid}><button type="button" onClick={() => onPhotoMode(!photoMode)}>{photoMode ? 'Exit photo mode' : 'Enter photo mode'}</button><button type="button" onClick={() => onPhotoHud(!photoHud)}>{photoHud ? 'Hide HUD' : 'Show HUD'}</button><button type="button" onClick={exportPng}>Save PNG</button></div>
        <label>Filter <select value={photoFilter} onChange={event => onPhotoFilter(event.target.value)}><option value="none">Natural</option><option value="sepia(0.7) saturate(0.8)">Sepia</option><option value="grayscale(1)">Memory monochrome</option><option value="saturate(1.5) contrast(1.08)">Vivid</option><option value="hue-rotate(35deg) saturate(1.2)">Dream glow</option></select></label>
        <label>Camera left/right <input type="range" min="-15" max="15" value={cameraX} onChange={event => { setCameraX(Number(event.target.value)); updateCamera({ x: event.target.value }); }} /></label>
        <label>Camera height <input type="range" min="0" max="14" value={cameraY} onChange={event => { setCameraY(Number(event.target.value)); updateCamera({ y: event.target.value }); }} /></label>
        <label>Zoom <input type="range" min=".65" max="1.8" step=".05" value={zoom} onChange={event => { setZoom(Number(event.target.value)); updateCamera({ zoom: event.target.value }); }} /></label>
      </div>
      <div><h3>New Game+</h3><p>Begin again with your keepsakes and memories retained.</p><button type="button" onClick={onNewGamePlus}>Start New Game+</button></div>
      <div><h3>Little secret</h3><label>Try a configured word <input value={eggInput} onChange={event => { setEggInput(event.target.value); checkEgg(event.target.value); }} placeholder="Type a secret trigger" /></label>{egg && <p role="status">{egg}</p>}{unlockSecret ? <button type="button" onClick={() => setSecretOpen(v => !v)}>{secretOpen ? 'Close secret level' : 'Open hidden memory level'}</button> : <p>Find every memory fragment to reveal the hidden level.</p>}{secretOpen && <p>Secret level unlocked: a quiet gallery of your collected memories. Keep exploring; this room is a keepsake rather than a new physics stage.</p>}</div>
    </>}
  </section>;
}
