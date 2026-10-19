import { describe, expect, it, vi } from 'vitest';
import { chapters, cutscenes, journalEntries, sheSaysFragments } from './narrative.js';
import { createDialogueRuntime } from './dialogue-runtime.js';
import { createCutsceneSequencer } from './cutscene-sequencer.js';

describe('narrative data', () => {
  it('contains eight chapters with scene dialogue and branching choices', () => {
    expect(chapters).toHaveLength(8);
    expect(chapters.every((chapter) => chapter.scenes.length >= 3)).toBe(true);
    expect(chapters.flatMap((chapter) => chapter.scenes).some((scene) => scene.choices?.length)).toBe(true);
  });
  it('provides replayable cutscenes, fragments, and exploration journal entries', () => {
    expect(cutscenes).toHaveLength(8);
    expect(cutscenes.every((scene) => scene.replayable && scene.steps.some((step) => step.type === 'waitForInput'))).toBe(true);
    expect(sheSaysFragments.length).toBeGreaterThanOrEqual(3);
    expect(journalEntries).toHaveLength(8);
  });
});
describe('dialogue runtime', () => {
  it('starts, advances lines, and applies choice effects', () => {
    const runtime = createDialogueRuntime();
    expect(runtime.start('chapter-01').activeLine.text).toContain('morning');
    runtime.advance();
    const choiceScene = runtime.current();
    const choice = choiceScene.choices[0];
    const result = runtime.choose(choice.id);
    expect(result.activeLine.text).toContain('drink both');
    expect(runtime.getState().variables.playfulness + runtime.getState().variables.care).toBe(1);
  });
  it('throws for unknown chapters and choices', () => {
    const runtime = createDialogueRuntime();
    expect(() => runtime.start('missing')).toThrow('Unknown chapter');
    runtime.start('chapter-01');
    expect(() => runtime.choose('missing')).toThrow('Unknown choice');
  });
});
describe('cutscene sequencer', () => {
  it('pauses for input, can advance, skip, and replay', () => {
    const onFinish = vi.fn();
    const controller = createCutsceneSequencer({ cutscene: cutscenes[0], onFinish });
    controller.start();
    let state = controller.getState();
    while (!state.waiting && !state.stopped) { controller.advance(); state = controller.getState(); }
    expect(state.waiting).toBe(true);
    controller.input();
    expect(controller.getState().index).toBeGreaterThan(state.index);
    controller.skip();
    expect(onFinish).toHaveBeenCalledWith({ skipped: true, cutsceneId: 'cs-opening' });
    controller.replay();
    expect(controller.getState().index).toBe(0);
  });
});
