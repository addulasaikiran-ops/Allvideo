import { describe, expect, it } from 'vitest';
import { createPlayerState, stepPlayer } from './physics.js';

describe('platform physics', () => {
  it('moves the player and records checkpoints', () => {
    const player = createPlayerState();
    stepPlayer(player, { horizontal: 1, jumpPressed: false }, 1 / 30);
    expect(player.x).toBeGreaterThan(-6);
    player.x = 2.1;
    stepPlayer(player, { horizontal: 0, jumpPressed: false }, 1 / 60);
    expect(player.checkpointId).toBe('meadow');
    expect(player.checkpointX).toBe(2);
  });

  it('jumps from the ground and lands without penalty', () => {
    const player = createPlayerState();
    stepPlayer(player, { horizontal: 0, jumpPressed: true }, 1 / 60);
    expect(player.grounded).toBe(false);
    expect(player.y).toBeGreaterThan(0);
    player.y = -5;
    stepPlayer(player, { horizontal: 0, jumpPressed: false }, 1 / 60);
    expect(player.y).toBe(0);
    expect(player.grounded).toBe(true);
    expect(player.checkpointId).toBe('start');
  });

  it('uses stronger jumps in assist mode', () => {
    const standard = createPlayerState();
    const assisted = createPlayerState();
    stepPlayer(standard, { horizontal: 0, jumpPressed: true }, 1 / 60);
    stepPlayer(assisted, { horizontal: 0, jumpPressed: true }, 1 / 60, true);
    expect(assisted.velocityY).toBeGreaterThan(standard.velocityY);
  });
});
