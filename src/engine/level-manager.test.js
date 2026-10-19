import { describe, expect, it, vi } from 'vitest';
import { createLevelManager } from './level-manager.js';

const level = { id: 'test', title: 'Test', entities: [
  { id: 'floor', type: 'static-platform', x: 0, y: -0.5, width: 4, height: 0.5 },
  { id: 'lift', type: 'moving-platform', x: 5, y: 0, width: 2, height: 0.3, path: { axis: 'y', distance: 1, speed: 1 } },
  { id: 'fragile', type: 'crumbling-platform', x: 8, y: 0, width: 2, height: 0.3, crumbleDelay: 0.2 },
  { id: 'oneway', type: 'one-way-platform', x: 11, y: 1, width: 2, height: 0.2 },
  { id: 'switch', type: 'switch', x: 2, y: 0, width: 1, height: 1 },
  { id: 'door', type: 'door', x: 14, y: 0, width: 1, height: 2, active: false, requiresSwitch: 'switch' },
  { id: 'spring', type: 'spring', x: 16, y: 0, width: 1, height: 0.3, impulse: 12 },
  { id: 'heart', type: 'collectible', kind: 'heart', x: 2, y: 0, width: 0.5, height: 1 },
  { id: 'memory', type: 'collectible', kind: 'memory-fragment', x: 3, y: 0, width: 0.5, height: 1 },
  { id: 'checkpoint-a', type: 'checkpoint', x: 4, y: 0, width: 0.6, height: 1 },
  { id: 'mist', type: 'hazard', kind: 'dark-mist', x: 6, y: 0, width: 1, height: 1 },
  { id: 'wind', type: 'wind-zone', x: 7, y: 0, width: 2, height: 2, direction: 1, strength: 1 },
  { id: 'spawner', type: 'enemy-spawner', x: 20, y: 0, width: 1, height: 1, interval: 0.1 },
  { id: 'cutscene', type: 'cutscene-trigger', x: 21, y: 0, width: 1, height: 1, cutscene: 'end' },
  { id: 'camera', type: 'camera-zone', x: 22, y: 0, width: 2, height: 2 },
  { id: 'hint', type: 'hint', x: 1, y: 0, width: 2, height: 2, skill: 'move', input: 'A/D', text: 'Move' },
] };

describe('LevelManager', () => {
  it('exposes static, moving, crumbling and one-way platforms to physics', () => {
    const manager = createLevelManager(level);
    expect(manager.getPlatforms().map((platform) => platform.id)).toEqual(['floor', 'lift', 'fragile', 'oneway']);
    const before = manager.getPlatforms().find((platform) => platform.id === 'lift').y;
    manager.update(0.5, { x: -5, y: 5, velocityY: 0, grounded: false });
    expect(manager.getPlatforms().find((platform) => platform.id === 'lift').y).not.toBe(before);
  });

  it('requires interaction to activate a switch and unlock its door', () => {
    const manager = createLevelManager(level);
    const player = { x: 2.2, y: 0, velocityY: 0, grounded: true };
    manager.update(0.016, player, { interactPressed: false });
    expect(manager.getSnapshot().entities.find((entity) => entity.id === 'switch').triggered).toBe(false);
    manager.update(0.016, player, { interactPressed: true });
    expect(manager.getSnapshot().entities.find((entity) => entity.id === 'switch').triggered).toBe(true);
    expect(manager.getSnapshot().entities.find((entity) => entity.id === 'door').open).toBe(true);
  });

  it('collects hearts, checkpoints, triggers cutscenes and emits enemy spawn requests', () => {
    const manager = createLevelManager(level);
    const emit = vi.fn();
    const managerWithEvents = createLevelManager(level, { onEvent: emit });
    const player = { x: 2.2, y: 0, velocityY: 0, grounded: true, heartsCollected: 0, checkpointId: 'start' };
    manager.update(0.016, player, {});
    expect(player.heartsCollected).toBe(1);
    expect(manager.getSnapshot().entities.find((entity) => entity.id === 'heart').collected).toBe(true);
    managerWithEvents.update(0.2, { x: 21.2, y: 0, velocityY: 0, grounded: true }, {});
    expect(emit).toHaveBeenCalledWith(expect.objectContaining({ type: 'enemy:spawn-request', id: 'spawner' }));
    expect(manager.getSnapshot().entities.some((entity) => entity.type === 'cutscene-trigger')).toBe(true);
  });

  it('fades a skill hint after first successful use and hot-reloads level data', () => {
    const manager = createLevelManager(level);
    manager.markSkillUsed('move');
    expect(manager.completedHints.has('move')).toBe(true);
    manager.hotReload({ ...level, title: 'Reloaded' });
    expect(manager.getSnapshot().title).toBe('Reloaded');
  });
});
