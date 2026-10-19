const DEFAULT_KEYS = {
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  jump: ['Space', 'ArrowUp', 'KeyW'],
};

export function createInput({ target = globalThis.window } = {}) {
  const pressed = new Set();
  const listeners = [];
  let touchAxis = 0;
  let touchJump = false;

  const onKeyDown = (event) => {
    const action = Object.entries(DEFAULT_KEYS).find(([, keys]) => keys.includes(event.code));
    if (action && event.code !== 'Space') event.preventDefault();
    if (action) pressed.add(action[0]);
  };
  const onKeyUp = (event) => {
    for (const [action, keys] of Object.entries(DEFAULT_KEYS)) {
      if (keys.includes(event.code)) pressed.delete(action);
    }
  };
  const onBlur = () => {
    pressed.clear();
    touchAxis = 0;
    touchJump = false;
  };

  if (target?.addEventListener) {
    target.addEventListener('keydown', onKeyDown);
    target.addEventListener('keyup', onKeyUp);
    target.addEventListener('blur', onBlur);
    listeners.push(() => target.removeEventListener('keydown', onKeyDown));
    listeners.push(() => target.removeEventListener('keyup', onKeyUp));
    listeners.push(() => target.removeEventListener('blur', onBlur));
  }

  return {
    read() {
      const gamepad = typeof navigator !== 'undefined' && navigator.getGamepads
        ? navigator.getGamepads()[0]
        : null;
      const gamepadX = gamepad?.axes?.[0] ?? 0;
      const horizontal = Math.abs(gamepadX) > 0.2
        ? Math.sign(gamepadX)
        : (pressed.has('left') ? -1 : 0) + (pressed.has('right') ? 1 : 0) || touchAxis;
      return {
        horizontal: Math.max(-1, Math.min(1, horizontal)),
        jumpPressed: pressed.has('jump') || touchJump || Boolean(gamepad?.buttons?.[0]?.pressed),
      };
    },
    setTouchAxis(value) {
      touchAxis = Math.max(-1, Math.min(1, Number(value) || 0));
    },
    setTouchJump(value) {
      touchJump = Boolean(value);
    },
    destroy() {
      listeners.forEach((remove) => remove());
      pressed.clear();
    },
  };
}
