import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import styles from './design-system.module.css';

const ToastContext = createContext(() => {});
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const notify = useCallback((message, tone = 'info') => {
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    setItems((all) => [...all.slice(-2), { id, message, tone }]);
    window.setTimeout(() => setItems((all) => all.filter((item) => item.id !== id)), 3600);
  }, []);
  return <ToastContext.Provider value={notify}>{children}<div className={styles.toastStack} aria-live="polite" aria-atomic="false">{items.map((item) => <div key={item.id} className={styles.toast} data-tone={item.tone} role="status">{item.message}<button className={styles.iconButton} aria-label="Dismiss notification" onClick={() => setItems((all) => all.filter((entry) => entry.id !== item.id))}>×</button></div>)}</div></ToastContext.Provider>;
}
export const useToast = () => useContext(ToastContext);

export function Button({ children, variant = 'primary', className = '', ...props }) { return <button className={`${styles.button} ${styles[variant] ?? ''} ${className}`} {...props}>{children}</button>; }
export function IconButton({ label, children, ...props }) { return <button className={styles.iconButton} aria-label={label} title={label} {...props}>{children}</button>; }
export function Panel({ children, tone = 'glass', className = '', ...props }) { return <section className={`${styles.panel} ${styles[tone] ?? ''} ${className}`} {...props}>{children}</section>; }
export function Slider({ label, value, onChange, min = 0, max = 100, step = 1, ...props }) { const id = useId(); return <label className={styles.slider} htmlFor={id}><span>{label}</span><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} {...props}/><output>{value}</output></label>; }
export function Toggle({ label, checked, onChange, ...props }) { return <label className={styles.toggle}><span>{label}</span><input type="checkbox" role="switch" checked={checked} onChange={(event) => onChange(event.target.checked)} {...props}/><i aria-hidden="true"/></label>; }
export function Tabs({ tabs, value, onChange, label = 'Sections' }) { return <div className={styles.tabs} role="tablist" aria-label={label}>{tabs.map((tab) => <button key={tab.id} id={`tab-${tab.id}`} type="button" role="tab" aria-selected={value === tab.id} aria-controls={`panel-${tab.id}`} tabIndex={value === tab.id ? 0 : -1} onClick={() => onChange(tab.id)}>{tab.label}</button>)}</div>; }
export function ProgressBar({ value, label = 'Progress', showValue = true }) { const amount = Math.max(0, Math.min(100, value)); return <div className={styles.progress}><div className={styles.progressMeta}><span>{label}</span>{showValue && <span className={styles.numerals}>{Math.round(amount)}%</span>}</div><div className={styles.progressTrack} role="progressbar" aria-label={label} aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(amount)}><span style={{ width: `${amount}%` }}/></div></div>; }
export function Tooltip({ label, children }) { return <span className={styles.tooltipWrap}>{children}<span role="tooltip" className={styles.tooltip}>{label}</span></span>; }

export function Modal({ title, open, onClose, children }) {
  const ref = useRef(null); const titleId = useId();
  useEffect(() => { if (!open) return undefined; const node = ref.current; const previous = document.activeElement; const focusable = () => [...node.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])')]; focusable()[0]?.focus(); const keydown = (event) => { if (event.key === 'Escape') { onClose(); return; } if (event.key === 'Tab') { const list = focusable(); if (!list.length) return; if (event.shiftKey && document.activeElement === list[0]) { event.preventDefault(); list.at(-1).focus(); } else if (!event.shiftKey && document.activeElement === list.at(-1)) { event.preventDefault(); list[0].focus(); } } }; document.addEventListener('keydown', keydown); return () => { document.removeEventListener('keydown', keydown); previous?.focus?.(); }; }, [open, onClose]);
  if (!open) return null;
  return <div className={styles.modalScrim} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section ref={ref} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}><header><h2 id={titleId}>{title}</h2><IconButton label="Close dialog" onClick={onClose}>×</IconButton></header>{children}</section></div>;
}

export function HeartMeter({ current = 3, max = 5 }) { return <div className={styles.heartMeter} aria-label={`${current} of ${max} hearts`} role="img">{Array.from({ length: max }, (_, i) => <svg key={i} viewBox="0 0 32 30" aria-hidden="true" className={i < current ? styles.heartFull : styles.heartEmpty}><path d="M16 27 4.5 15.5C-2 8.8 7.8-.8 16 7 24.2-.8 34 8.8 27.5 15.5Z"/></svg>)}</div>; }

export function LoadingScreen({ progress = 0, tip = 'Every little step counts.' }) { return <main className={styles.screenCenter} aria-label="Loading story"><svg className={styles.drawingHeart} viewBox="0 0 100 90" aria-hidden="true"><path d="M50 80 12 42C-10 18 20-4 40 16L50 26 60 16C80-4 110 18 88 42Z"/></svg><p className={styles.kicker}>A LITTLE MORE LIGHT</p><h1>Gathering the little things</h1><ProgressBar value={progress} label="Preparing your story"/><p className={styles.tip} aria-live="polite">{tip}</p></main>; }

export function TitleScreen({ onStart, onContinue, chapter = 'The Quiet Morning', progress = 0 }) { const [shown, setShown] = useState(false); useEffect(() => { const id = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(id); }, []); return <main className={`${styles.titleScreen} ${shown ? styles.revealed : ''}`}><div className={styles.stars} aria-hidden="true"/><div className={styles.titleCopy}><p className={styles.kicker}>A STORY ABOUT FINDING YOUR WAY</p><h1 className={styles.logo}>A Little<br/><em>More Light</em></h1><p className={styles.lede}>Some journeys begin with a single, gentle step.</p><div className={styles.menu}><Button onClick={onStart}>Begin a new journey <span aria-hidden="true">↗</span></Button><Button variant="secondary" onClick={onContinue}>Continue <span className={styles.continueMeta}>{chapter} · {progress}%</span></Button></div><p className={styles.hint}>Move with ← → or A / D · Jump with Space</p></div></main>; }

const ChapterScreen = lazy(() => import('./screens/ChapterSelect.jsx'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen.jsx'));
const GalleryScreen = lazy(() => import('./screens/MemoryGallery.jsx'));
const CreditsScreen = lazy(() => import('./screens/CreditsScreen.jsx'));
const ErrorScreen = lazy(() => import('./screens/ErrorScreen.jsx'));
const OfflineScreen = lazy(() => import('./screens/OfflineScreen.jsx'));
const RotateScreen = lazy(() => import('./screens/RotateScreen.jsx'));
const PauseScreen = lazy(() => import('./screens/PauseScreen.jsx'));
const ChapterComplete = lazy(() => import('./screens/ChapterComplete.jsx'));
export function ScreenOutlet({ screen, ...props }) { const screens = { chapters: ChapterScreen, settings: SettingsScreen, gallery: GalleryScreen, credits: CreditsScreen, error: ErrorScreen, offline: OfflineScreen, rotate: RotateScreen, pause: PauseScreen, complete: ChapterComplete }; const Screen = screens[screen]; if (!Screen) return null; return <Suspense fallback={<LoadingScreen progress={70} tip="Turning the next page…"/>}><Screen {...props}/></Suspense>; }
