import { chapters, localize } from './narrative.js';
/** Small framework-free dialogue runner with persistent variables and branching choices. */
export function createDialogueRuntime({ story = chapters, variables = {}, catalog } = {}) {
 const state = { variables: { trust: 0, playfulness: 0, patience: 0, exploration: 0, care: 0, collectibles: 0, ...variables }, chapterId: null, cursor: 0, history: [], seen: new Set(), fragments: new Set() };
 const chapter = () => story.find((item) => item.id === state.chapterId);
 const current = () => chapter()?.scenes[state.cursor] ?? null;
 return {
  getState: () => ({ ...state, variables: { ...state.variables }, history: [...state.history], seen: [...state.seen], fragments: [...state.fragments] }),
  start(chapterId) { const target = story.find((item) => item.id === chapterId); if (!target) throw new Error('Unknown chapter: ' + chapterId); state.chapterId = chapterId; state.cursor = 0; state.history = []; return current(); },
  current,
  present() { const item = current(); if (!item) return null; state.seen.add(item.id); if (item.fragmentId && item.sheSays) state.fragments.add(item.fragmentId); return { ...item, text: localize(item.textKey, {}, catalog) }; },
  advance() { if (!current()) return null; state.cursor += 1; return current(); },
  choose(choiceId) { const item = chapter(); const selected = item?.choices?.find((entry) => entry.id === choiceId); if (!selected) throw new Error('Unknown choice: ' + choiceId); state.history.push({ chapterId: state.chapterId, choiceId }); Object.entries(selected.effects ?? {}).forEach(([key, amount]) => { state.variables[key] = (Number(state.variables[key]) || 0) + amount; }); const target = item.scenes.findIndex((scene) => scene.id === selected.next); if (target >= 0) state.cursor = target; return current(); },
  setVariable(key, value) { state.variables[key] = value; },
  hasFragment(id) { return state.fragments.has(id); },
 };
}
