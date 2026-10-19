import { chapters, localize, narrativeMessages } from './narrative.js';
import { personalConfig } from './personal.config.js';

/** Framework-free dialogue runner. Scenes, choices, variables, and optional fragments stay data-driven. */
export function createDialogueRuntime({ story = chapters, variables = {}, catalog } = {}) {
  const state = {
    variables: { trust: 0, playfulness: 0, patience: 0, exploration: 0, care: 0, collectibles: 0, ...variables },
    chapterId: null, cursor: 0, lineCursor: 0, history: [], seen: new Set(), fragments: new Set(),
  };
  const chapter = () => story.find((item) => item.id === state.chapterId);
  const current = () => chapter()?.scenes[state.cursor] ?? null;
  const personalize = (line) => {
    const vars = {
      nickname: personalConfig.personalization?.nickname || 'friend',
      insideJoke: personalConfig.personalization?.insideJoke || 'our very specific joke',
      heroine: personalConfig.names.heroine,
      him: personalConfig.names.boyfriend,
    };
    const override = line.fragmentId && personalConfig.personalization?.sheSaysOverrides?.[line.fragmentId];
    const messages = { ...narrativeMessages, ...(catalog ?? {}), [line.textKey]: catalog?.[line.textKey] ?? line.fallback ?? line.textKey };
    return { ...line, text: localize(line.textKey, vars, messages), ...(override ? { text: override } : {}) };
  };
  const snapshot = () => ({
    ...state, variables: { ...state.variables }, history: [...state.history],
    seen: [...state.seen], fragments: [...state.fragments],
  });
  return {
    getState: snapshot,
    start(chapterId) {
      const target = story.find((item) => item.id === chapterId);
      if (!target) throw new Error('Unknown chapter: ' + chapterId);
      state.chapterId = chapterId; state.cursor = 0; state.lineCursor = 0; state.history = [];
      return this.present();
    },
    current,
    present() {
      const item = current();
      if (!item) return null;
      state.seen.add(item.id);
      const lines = (item.lines ?? []).map(personalize);
      const activeLine = lines[state.lineCursor] ?? null;
      if (activeLine?.fragmentId && item.sheSays) state.fragments.add(activeLine.fragmentId);
      if (item.fragmentId && item.sheSays) state.fragments.add(item.fragmentId);
      return { ...item, lines, activeLine, text: activeLine?.text ?? '', choices: item.choices ?? [] };
    },
    advance() {
      const item = current();
      if (!item) return null;
      if (state.lineCursor + 1 < (item.lines ?? []).length) state.lineCursor += 1;
      else { state.cursor += 1; state.lineCursor = 0; }
      return this.present();
    },
    choose(choiceId) {
      const item = current();
      const selected = item?.choices?.find((entry) => entry.id === choiceId);
      if (!selected) throw new Error('Unknown choice: ' + choiceId);
      state.history.push({ chapterId: state.chapterId, sceneId: item.id, choiceId });
      Object.entries(selected.effects ?? {}).forEach(([key, amount]) => {
        state.variables[key] = (Number(state.variables[key]) || 0) + amount;
      });
      const target = chapter().scenes.findIndex((entry) => entry.id === selected.next);
      if (target >= 0) { state.cursor = target; state.lineCursor = 0; }
      return this.present();
    },
    setVariable(key, value) { state.variables[key] = value; },
    hasFragment(id) { return state.fragments.has(id); },
    replay(chapterId = state.chapterId) { return this.start(chapterId); },
  };
}
