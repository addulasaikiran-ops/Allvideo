const clone = (value) => JSON.parse(JSON.stringify(value));
const overlaps = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

export class LevelManager {
  constructor(level, { onEvent = () => {} } = {}) {
    this.onEvent = onEvent;
    this.load(level);
  }

  load(level) {
    if (!level || !Array.isArray(level.entities)) throw new TypeError('Level must contain an entities array');
    this.level = clone(level);
    this.elapsed = 0;
    this.entities = this.level.entities.map((entity) => ({
      ...entity,
      originX: entity.x ?? 0,
      originY: entity.y ?? 0,
      active: entity.active !== false,
      triggered: false,
      collected: false,
      crumbleTimer: null,
      phase: entity.phase ?? 0,
    }));
    this.completedHints = new Set();
    this.switches = new Set();
    this.events = [];
    this.lastPlayerX = null;
  }

  emit(type, entity, extra = {}) {
    const event = { type, id: entity?.id ?? null, ...extra };
    this.events.push(event);
    this.onEvent(event);
  }

  update(dt, player, input = {}) {
    const step = Math.min(Math.max(dt || 0, 0), 0.1);
    this.elapsed += step;
    this.events = [];
    for (const entity of this.entities) {
      if (entity.type === 'moving-platform' && entity.active) {
        const path = entity.path ?? { axis: 'x', distance: 2, speed: 1 };
        const offset = Math.sin(this.elapsed * path.speed + entity.phase) * path.distance;
        entity.x = entity.originX + (path.axis === 'x' ? offset : 0);
        entity.y = entity.originY + (path.axis === 'y' ? offset : 0);
      }
      if (entity.type === 'crumbling-platform' && this.playerTouches(player, entity) && entity.crumbleTimer === null) entity.crumbleTimer = entity.crumbleDelay ?? 1;\n      if (entity.type === 'crumbling-platform' && entity.crumbleTimer !== null) {
        entity.crumbleTimer -= step;
        if (entity.crumbleTimer <= 0) { entity.active = false; this.emit('platform:crumbled', entity); }
      }
      if (entity.type === 'enemy-spawner' && entity.active) {
        entity.spawnTimer = (entity.spawnTimer ?? entity.interval ?? 8) - step;
        if (entity.spawnTimer <= 0) { entity.spawnTimer = entity.interval ?? 8; this.emit('enemy:spawn-request', entity, { enemy: entity.enemy ?? 'shade' }); }
      }
      if (entity.type === 'switch' && entity.active && input.interactPressed && !entity.triggered && this.playerTouches(player, entity)) {
        entity.triggered = true; this.switches.add(entity.id); this.emit('switch:activated', entity);
        for (const target of this.entities.filter((item) => item.requiresSwitch === entity.id)) {
          target.active = true;
          if (target.type === 'door') target.open = true;
          this.emit('entity:unlocked', target, { switchId: entity.id });
        }
      }
      if (entity.type === 'checkpoint' && this.playerTouches(player, entity) && player.checkpointId !== entity.id) {
        player.checkpointId = entity.id; player.checkpointX = entity.x; player.checkpointY = entity.y;
        this.emit('checkpoint:reached', entity, { checkpointId: entity.id });
      }
      if (entity.type === 'collectible' && !entity.collected && this.playerTouches(player, entity)) {
        entity.collected = true;
        if (entity.kind === 'heart') player.heartsCollected = (player.heartsCollected ?? 0) + 1;
        this.emit('collectible:collected', entity, { kind: entity.kind });
      }
      if (entity.type === 'cutscene-trigger' && !entity.triggered && this.playerTouches(player, entity)) {
        entity.triggered = true; this.emit('cutscene:trigger', entity, { cutscene: entity.cutscene });
      }
      if (entity.type === 'hazard' && entity.active && !entity.safe && this.playerTouches(player, entity)) {
        if (entity.kind === 'dark-mist' && input.pulseActive) { entity.cleared = true; entity.active = false; this.emit('hazard:cleared', entity); }
        else if (!entity.triggered) { entity.triggered = true; this.emit('hazard:contact', entity, { hazard: entity.kind }); }
      }
      if (entity.type === 'wind-zone' && this.playerTouches(player, entity)) player.velocityX += (entity.direction ?? 1) * (entity.strength ?? 0.4) * step;\n      if (entity.type === 'spring' && entity.active && this.playerTouches(player, entity) && player.velocityY <= 0) {
        player.velocityY = entity.impulse ?? 11; player.grounded = false; player.jumpsUsed = 1;
        this.emit('spring:launched', entity);
      }
      if (entity.type === 'hint' && !this.completedHints.has(entity.skill) && this.playerTouches(player, entity)) {
        this.emit('hint:show', entity, { skill: entity.skill, text: entity.text, input: entity.input });
      }
    }
    this.lastPlayerX = player.x;
    return this.events;
  }

  playerTouches(player, entity) {
    const p = { x: player.x - 0.3, y: player.y, width: 0.6, height: 1.65 };
    return overlaps(p, { x: entity.x, y: entity.y, width: entity.width ?? 0.7, height: entity.height ?? 1 });
  }

  markSkillUsed(skill) {
    if (this.completedHints.has(skill)) return;
    this.completedHints.add(skill);
    const hint = this.entities.find((item) => item.type === 'hint' && item.skill === skill);
    if (hint) this.emit('hint:fade', hint, { skill });
  }

  getPlatforms() {
    return this.entities.filter((entity) => entity.active && ['static-platform', 'moving-platform', 'crumbling-platform', 'one-way-platform'].includes(entity.type))
      .map((entity) => ({ x: entity.x + entity.width / 2, y: entity.y + entity.height, width: entity.width, surface: entity.surface ?? 'stone', oneWay: entity.type === 'one-way-platform', id: entity.id }));
  }

  getSnapshot() {
    return { id: this.level.id, title: this.level.title, parallax: clone(this.level.parallax ?? []), entities: this.entities.map((entity) => ({ ...entity })), switches: [...this.switches], elapsed: this.elapsed };
  }

  hotReload(level) {
    const preserved = new Set(this.entities.filter((entity) => entity.collected).map((entity) => entity.id));
    this.load(level);
    for (const entity of this.entities) if (preserved.has(entity.id) && entity.type === 'collectible') entity.collected = true;
    this.emit('level:reloaded', null, { levelId: this.level.id });
  }
}

export function createLevelManager(level, options) {
  return new LevelManager(level, options);
}
