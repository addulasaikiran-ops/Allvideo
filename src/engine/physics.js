export const PHYSICS = Object.freeze({
  moveSpeed: 5.2,
  jumpSpeed: 8.8,
  gravity: 22,
  groundY: 0,
  worldStart: -8,
  worldEnd: 22,
});

export function createPlayerState() {
  return {
    x: -6,
    y: PHYSICS.groundY,
    velocityY: 0,
    grounded: true,
    checkpointX: -6,
    checkpointId: 'start',
    respawnFlash: 0,
  };
}

export function stepPlayer(player, input, deltaSeconds, assistMode = false) {
  const dt = Math.min(Math.max(deltaSeconds, 0), 1 / 30);
  player.x += input.horizontal * PHYSICS.moveSpeed * dt;
  player.x = Math.max(PHYSICS.worldStart, Math.min(PHYSICS.worldEnd, player.x));

  if (input.jumpPressed && player.grounded) {
    player.velocityY = assistMode ? PHYSICS.jumpSpeed * 1.18 : PHYSICS.jumpSpeed;
    player.grounded = false;
  }

  if (!player.grounded) {
    player.velocityY -= PHYSICS.gravity * dt;
    player.y += player.velocityY * dt;
    if (player.y <= PHYSICS.groundY) {
      player.y = PHYSICS.groundY;
      player.velocityY = 0;
      player.grounded = true;
    }
  }

  // Falling off-screen is a gentle reset: no lives, score, or progress are lost.
  if (player.y < -4) {
    player.x = player.checkpointX;
    player.y = PHYSICS.groundY;
    player.velocityY = 0;
    player.grounded = true;
    player.respawnFlash = 0.45;
  }

  if (player.respawnFlash > 0) player.respawnFlash = Math.max(0, player.respawnFlash - dt);

  const checkpoints = [
    { id: 'meadow', x: 2 },
    { id: 'lantern-bridge', x: 12 },
  ];
  for (const checkpoint of checkpoints) {
    if (player.x >= checkpoint.x && player.checkpointId !== checkpoint.id) {
      player.checkpointX = checkpoint.x;
      player.checkpointId = checkpoint.id;
    }
  }

  return player;
}
