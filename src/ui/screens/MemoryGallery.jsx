import { useState } from 'react';
import { Button, Panel } from '../design-system.jsx';
import { personalConfig } from '../../story/personal.config.js';
import { chapters, cutscenes, journalEntries, sheSaysFragments, localize } from '../../story/narrative.js';
import { createCutsceneSequencer } from '../../story/cutscene-sequencer.js';
import { createDialogueRuntime } from '../../story/dialogue-runtime.js';
import styles from './Screens.module.css';

const cueLabel = (step) => {
  if (!step) return 'Ready when you are.';
  if (step.type === 'waitForInput') return 'Waiting for you to continue.';
  if (step.type === 'camera') return 'Camera moves gently through the scene.';
  if (step.type === 'fade') return step.to === 'black' ? 'The scene fades to dark.' : 'The scene returns to view.';
  if (step.type === 'letterbox') return step.show ? 'Cinematic frame appears.' : 'Cinematic frame lifts.';
  if (step.type === 'animation') return `${step.character} · ${step.cue.replaceAll('-', ' ')}`;
  if (step.type === 'music') return `Music cue · ${step.cue.replaceAll('-', ' ')}`;
  return step.type;
};

export default function MemoryGallery({ onClose }) {
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState('memories');
  const [visited, setVisited] = useState([]);
  const [foundFragments, setFoundFragments] = useState([]);
  const [playback, setPlayback] = useState(null);
  const [playbackState, setPlaybackState] = useState(null);
  const memories = personalConfig.memoryScenes ?? [];
  const item = memories[index];
  const discoveries = new Set([...visited, ...foundFragments, ...exploredChapters]).size;
  const currentCutscene = playback ? cutscenes.find((entry) => entry.id === playback) : null;
  const remember = (memoryId) => setVisited((all) => all.includes(memoryId) ? all : [...all, memoryId]);
  const startCutscene = (cutscene, replay = false) => {
    const controller = createCutsceneSequencer({
      cutscene,
      onStep: (state) => setPlaybackState(state),
      onFinish: ({ skipped }) => setPlaybackState((state) => state ? { ...state, waiting: false, stopped: true, skipped } : state),
    });
    setPlayback(cutscene.id);
    setPlaybackState(null);
    replay ? controller.replay() : controller.start();
    setPlaybackController(controller);
  };
  const [playbackController, setPlaybackController] = useState(null);
  const [dialogueRuntime] = useState(() => createDialogueRuntime());
  const [storyChapter, setStoryChapter] = useState(chapters[0].id);
  const [dialogue, setDialogue] = useState(null);\n  const [exploredChapters, setExploredChapters] = useState([]);\n  const showDialogue = (result) => {\n    setDialogue(result);\n    const fragmentId = result?.activeLine?.fragmentId || result?.fragmentId;\n    if (fragmentId) setFoundFragments((all) => all.includes(fragmentId) ? all : [...all, fragmentId]);\n    return result;\n  };
  const revealFragment = (fragment) => setFoundFragments((all) => all.includes(fragment.id) ? all : [...all, fragment.id]);

  return <main className={styles.screen}>
    <header className={styles.header}><p className={styles.kicker}>KEEPSAKES</p><h1>Memory Gallery</h1><p>Little moments, held gently.</p></header>
    <nav className={styles.actions} aria-label="Memory gallery sections">
      <Button variant={tab === 'story' ? 'primary' : 'secondary'} onClick={() => setTab('story')}>Read chapters</Button>
      <Button variant={tab === 'memories' ? 'primary' : 'secondary'} onClick={() => setTab('memories')}>Memories</Button>
      <Button variant={tab === 'cutscenes' ? 'primary' : 'secondary'} onClick={() => setTab('cutscenes')}>Replay scenes</Button>
      <Button variant={tab === 'journal' ? 'primary' : 'secondary'} onClick={() => setTab('journal')}>Things she learned</Button>
      <Button variant={tab === 'fragments' ? 'primary' : 'secondary'} onClick={() => setTab('fragments')}>Her words</Button>
    </nav>
    {tab === 'story' && <Panel className={styles.memoryCard}>
      <h2>Eight little chapters</h2>
      <label>Choose a chapter <select value={storyChapter} onChange={(event) => { setStoryChapter(event.target.value); setDialogue(null); }}>{chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{localize(chapter.titleKey)}</option>)}</select></label>
      <div className={styles.actions}><Button onClick={() => { setExploredChapters((all) => all.includes(storyChapter) ? all : [...all, storyChapter]); showDialogue(dialogueRuntime.start(storyChapter)); }}>Begin / restart chapter</Button></div>
      {dialogue && <>
        <p className={styles.kicker}>{dialogue.speaker ? dialogue.speaker : localize(chapters.find((chapter) => chapter.id === storyChapter)?.titleKey)}</p>
        <h3>{dialogue.activeLine?.speaker === 'heroine' ? personalConfig.names.heroine : dialogue.activeLine?.speaker === 'him' ? personalConfig.names.boyfriend : 'A quiet voice'}</h3>
        <p aria-live="polite">{dialogue.activeLine?.text ?? 'That chapter has reached its last page. You can begin it again or choose another.'}</p>
        {dialogue.activeLine?.emotion && <p><em>Feeling: {dialogue.activeLine.emotion}</em></p>}
        {dialogue.choices?.length && dialogue.activeLine === dialogue.lines?.at(-1) ? <div className={styles.actions}>{dialogue.choices.map((choice) => <Button key={choice.id} onClick={() => showDialogue(dialogueRuntime.choose(choice.id))}>{choice.label}</Button>)}</div> : <div className={styles.actions}><Button onClick={() => showDialogue(dialogueRuntime.advance())} disabled={!dialogue.activeLine}>Next line →</Button></div>}
        {dialogue.fragmentId && dialogue.sheSays && <p>✦ A hidden fragment has appeared in Her words.</p>}
      </>}
    </Panel>}
    {tab === 'memories' && item && <Panel className={styles.memoryCard}>
      <div className={styles.memoryArt} style={{ '--memory-accent': item.accent }} aria-hidden="true">{['✿','☂','❀','☾'][index % 4]}</div>
      <p className={styles.kicker}>{String(index + 1).padStart(2, '0')} / {String(memories.length).padStart(2, '0')}</p>
      <h2>{item.title}</h2>{item.date && <p>{item.date}</p>}<p>{item.caption}</p><p>{item.detail}</p>
      {item.photo && <img src={item.photo} alt={item.title} loading="lazy" />}
      <div className={styles.actions}>
        <Button variant="secondary" disabled={index === 0} onClick={() => { remember(item.id); setIndex((i) => i - 1); }}>← Previous</Button>
        <Button onClick={() => remember(item.id)}>Keep this detail</Button>
        <Button disabled={index === memories.length - 1} onClick={() => { remember(item.id); setIndex((i) => i + 1); }}>Next memory →</Button>
      </div>
      <p role="status">Exploration notes collected: {discoveries}</p>
    </Panel>}
    {tab === 'cutscenes' && <Panel className={styles.memoryCard}>
      <h2>{currentCutscene ? currentCutscene.title : 'A scene, whenever you need it'}</h2>
      {currentCutscene ? <>
        <p role="status">{cueLabel(playbackState?.step)} {playbackState ? `· Step ${playbackState.index + 1} of ${playbackState.total}` : ''}</p>
        <div className={styles.actions}>
          <Button onClick={() => playbackController?.input() ?? playbackController?.advance()} disabled={!playbackState || playbackState.stopped}>Continue</Button>
          <Button variant="secondary" onClick={() => playbackController?.skip()} disabled={!playbackState || playbackState.stopped}>Skip scene</Button>
          <Button variant="secondary" onClick={() => startCutscene(currentCutscene, true)}>Replay from start</Button>
        </div>
      </> : <p>Every scene can be replayed here. You can skip any time; nothing is lost.</p>}
      <div className={styles.actions}>{cutscenes.map((cutscene) => <Button key={cutscene.id} variant="secondary" onClick={() => startCutscene(cutscene)}>{cutscene.title}</Button>)}</div>
    </Panel>}
    {tab === 'journal' && <Panel className={styles.memoryCard}>
      <h2>Things she learned about him</h2>
      <p>Small observations, found by taking time with the world. Explore memories and uncover her words to open more notes.</p>
      <p>Discoveries: {discoveries} · Unlocked: {journalEntries.filter((entry) => discoveries >= entry.requires.collectibles).length} / {journalEntries.length}</p>
      {journalEntries.map((entry) => <article key={entry.id}><h3>{discoveries >= entry.requires.collectibles ? entry.title : 'A note still waiting'}</h3><p>{discoveries >= entry.requires.collectibles ? entry.text : `Find ${entry.requires.collectibles - discoveries} more ${entry.requires.collectibles - discoveries === 1 ? 'detail' : 'details'} to unlock this note.`}</p></article>)}
    </Panel>}
    {tab === 'fragments' && <Panel className={styles.memoryCard}>
      <h2>Things she wanted to say</h2><p>Some words are tucked away until you find them.</p>
      {sheSaysFragments.map((fragment) => {
        const found = foundFragments.includes(fragment.id);
        const text = personalConfig.personalization?.sheSaysOverrides?.[fragment.id] || localize(fragment.textKey, { nickname: personalConfig.personalization?.nickname || 'friend', insideJoke: personalConfig.personalization?.insideJoke || 'our very specific joke' });
        return <article key={fragment.id}><h3>{fragment.title}</h3>{found ? <p>{text || fragment.fallback}</p> : <><p>Fragment hidden.</p><Button onClick={() => revealFragment(fragment)}>Find this fragment</Button></>}</article>;
      })}
    </Panel>}
    <Button variant="secondary" onClick={onClose}>Back to story</Button>
  </main>;
}
