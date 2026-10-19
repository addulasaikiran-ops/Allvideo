import { describe, expect, it } from 'vitest';
import { createPlayerState, stepPlayer } from './physics.js';
import { PLAYER_CONFIG } from './player/player.config.js';

const idle = {
  horizontal: 0,
  jumpPressed: false,
  jumpHeld: false,
  pulsePressed: false,
  restPressed: false,
  victoryPressed: false,
};

describe('assist physics', () => {
  it('rescues a falling player when invulnerability is enabled', () => {
    const player = createPlayerState();
    player.x = 8;
    player.y = PLAYER_CONFIG.deathY - 0.1;
    player.checkpointX = 3;
    player.checkpointY = 1.2;
    player.checkpointId = 'test-checkpoint';

    stepPlayer(player, idle, 1 / 60, false, PLAYER_CONFIG, [], { invulnerability: true });

    expect(player.x).toBe(3);
    expect(player.y).toBe(1.2);
    expect(player.grounded).toBe(true);
    expect(player.deathTimer).toBe(0);
    expect(player.events.some((event) => event.type === 'player:assist-rescue')).toBe(true);
    expect(player.events.some((event) => event.type === 'player:death-burst')).toBe(false);
  });

  it('retains normal death behavior when invulnerability is disabled', () => {
    const player = createPlayerState();
    player.y = PLAYER_CONFIG.deathY - 0.1;

    stepPlayer(player, idle, 1 / 60, false, PLAYER_CONFIG, [], { invulnerability: false });

    expect(player.deathTimer).toBeGreaterThan(0);
    expect(player.events.some((event) => event.type === 'player:death-burst')).toBe(true);
    expect(player.events.some((event) => event.type === 'player:assist-rescue')).toBe(false);
  });
});
