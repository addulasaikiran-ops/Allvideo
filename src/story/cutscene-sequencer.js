/** Framework-neutral cutscene sequence controller. The host supplies rendering/audio callbacks. */
export function createCutsceneSequencer({ cutscene, onCue = () => {}, onStep = () => {}, onFinish = () => {} } = {}) {
  if (!cutscene || !Array.isArray(cutscene.steps)) throw new TypeError('A cutscene with steps is required');
  let index = 0;
  let stopped = false;
  let waiting = false;
  const emit = () => {
    if (stopped) return null;
    const step = cutscene.steps[index];
    if (!step) { stopped = true; waiting = false; onFinish({ skipped: false, cutsceneId: cutscene.id }); return null; }
    waiting = step.type === 'waitForInput';
    onCue(step);
    onStep({ step, index, total: cutscene.steps.length, waiting });
    return step;
  };
  return {
    getState: () => ({ index, total: cutscene.steps.length, waiting, stopped, cutsceneId: cutscene.id }),
    start() { index = 0; stopped = false; waiting = false; return emit(); },
    advance() { if (stopped) return null; if (waiting) waiting = false; index += 1; return emit(); },
    input() { return waiting ? this.advance() : null; },
    skip() { if (stopped) return; stopped = true; waiting = false; onFinish({ skipped: true, cutsceneId: cutscene.id }); },
    replay() { index = 0; stopped = false; waiting = false; return emit(); },
  };
}
