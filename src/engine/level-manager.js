const clone = (value) => JSON.parse(JSON.stringify(value));
const overlaps = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
const distanceBetween = (a, b) => Math.hypot((a.x + (a.width ?? 0.6) / 2) - (b.x + (b.width ?? 0.7) / 2), (a.y + (a.height ?? 1) / 2) - (b.y + (b.height ?? 1) / 2));

export class LevelManager {
  constructor(level, { onEvent = () => {} } = {}) { this.onEvent = onEvent; this.load(level); }

  load(level) {
    if (!level || !Array.isArray(level.entities)) throw new TypeError('Level must contain an entities array');
    this.level = clone(level);
    this.elapsed = 0;
    this.entities = this.level.entities.map((entity) => ({
      ...entity, originX: entity.x ?? 0, originY: entity.y ?? 0, active: entity.type === 'light-bridge' ? false : entity.active !== false,
      triggered: false, collected: false, crumbleTimer: null, phase: entity.phase ?? entity.path?.phase ?? 0,
      stuckTimer: 0, hintShown: false, calmTimer: 0, projectileTimer: entity.projectileInterval ?? 3,
    }));
    this.completedHints = new Set(); this.switches = new Set(); this.events = []; this.lastPlayerX = null;
    this.clearedKnots = new Set(); this.slowTimer = 0; this.slowScale = 1; this.heartTotalAtLoad = this.entities.filter((entity) => entity.type === 'collectible' && entity.kind === 'heart').length;
  }

  emit(type, entity, extra = {}) {
    const event = { type, id: entity?.id ?? null, ...extra }; this.events.push(event); this.onEvent(event);
  }

  update(dt, player, input = {}) {
    const realStep = Math.min(Math.max(dt || 0, 0), 0.1); const step = realStep * this.getTimeScale(); this.slowTimer = Math.max(0, this.slowTimer - realStep); this.elapsed += step; this.events = [];
    const pulsePressed = Boolean(input.pulsePressed);
    for (const entity of this.entities) {
      if (entity.type === 'moving-platform' && entity.active) {
        const path = entity.path ?? { axis: 'x', distance: 2, speed: 1 };
        const offset = Math.sin(this.elapsed * path.speed + (path.phase ?? entity.phase)) * path.distance;
        entity.x = entity.originX + (path.axis === 'x' ? offset : 0); entity.y = entity.originY + (path.axis === 'y' ? offset : 0);
      }
      if (entity.type === 'light-bridge') {
        const nearbyCollected = this.entities.filter((item) => item.type === 'collectible' && item.kind === 'heart' && item.collected && distanceBetween(item, entity) <= (entity.heartRadius ?? 10)).length;
        const shouldActivate = nearbyCollected >= (entity.requiresHearts ?? 1);
        if (shouldActivate && !entity.active) { entity.active = true; this.emit('bridge:formed', entity, { hearts: nearbyCollected }); }
        if (!shouldActivate && entity.active) entity.active = false;
      }
      if (entity.type === 'clock-hand') {
        entity.angle = Math.sin(this.elapsed * Math.PI * 2 / (entity.period ?? 5) + (entity.phase ?? 0)) * (entity.amplitude ?? 1);
      }
      if (entity.type === 'pendulum') {
        entity.angle = Math.sin(this.elapsed * Math.PI * 2 / (entity.period ?? 4.5) + (entity.phase ?? 0)) * (entity.amplitude ?? 0.75);
      }
      if (entity.type === 'enemy' && entity.behavior === 'patrol') {
        entity.x = entity.originX + Math.sin(this.elapsed * (entity.patrolSpeed ?? 0.7) + entity.phase) * (entity.patrolDistance ?? 2);
      }
      if (entity.type === 'rest-lantern' && (entity.restCooldown ?? 0) <= 0 && input.interactPressed && this.playerTouches(player, entity)) {
        entity.restCooldown = entity.restCooldownDuration ?? 3;
        this.slowTimer = entity.slowDuration ?? 4;
        this.slowScale = entity.slowScale ?? 0.45;
        this.emit('rest:activated', entity, { heal: entity.heal ?? 1, duration: this.slowTimer, timeScale: this.slowScale, text: entity.text ?? 'Rest is progress.' });
      }
      if (['mirror', 'mirror-boss'].includes(entity.type) && !entity.triggered && input.interactPressed && this.playerTouches(player, entity)) {
        const choices = entity.choices ?? [{ id: 'kind', label: 'I can be kind to myself.', kind: 'kind' }];
        const availableChoices = entity.type === 'mirror-boss'
          ? choices.filter((choice) => !(entity.answeredChoiceIds ?? []).includes(choice.id))
          : choices;
        this.emit('mirror:choice', entity, { whisper: entity.whisper, choices: availableChoices, truth: entity.truth, boss: entity.type === 'mirror-boss', cracks: entity.cracks ?? 0, requiredTruths: entity.requiredTruths ?? 1 });
      }
      if (entity.type === 'enemy') {
        if (entity.calmTimer > 0) entity.calmTimer = Math.max(0, entity.calmTimer - step);
        const radius = entity.pulseRadius ?? 3.2;
        if (pulsePressed && distanceBetween(player, entity) <= radius + 0.8) {
          entity.calmTimer = entity.calmDuration ?? 5;
          this.emit('enemy:calmed', entity, { enemy: entity.enemy, duration: entity.calmTimer });
        }
        if (entity.behavior === 'gentle-spark-shot' && entity.calmTimer <= 0) {
          entity.projectileTimer -= step;
          if (entity.projectileTimer <= 0) {
            entity.projectileTimer = entity.projectileInterval ?? 3.5;
            this.emit('enemy:projectile', entity, { enemy: entity.enemy, projectile: entity.projectile ?? 'spark', speed: entity.projectileSpeed ?? 2, direction: player.x >= entity.x ? 1 : -1 });
          }
        }
        entity.x = entity.originX + Math.sin(this.elapsed * (entity.orbitSpeed ?? 1) + entity.phase) * (entity.orbitRadius ?? 0.8);
        entity.y = entity.originY + Math.cos(this.elapsed * (entity.orbitSpeed ?? 1) * 0.7 + entity.phase) * 0.28;
      }
      if (entity.type === 'thorn-knot' && !entity.cleared) {
        const expectedOrder = this.entities.filter((item) => item.type === 'thorn-knot' && this.clearedKnots.has(item.id)).length + 1;
        const close = distanceBetween(player, entity) <= (entity.pulseRadius ?? 3.2) + 0.8;
        if (close && entity.order === expectedOrder) {
          entity.stuckTimer += step;
          if (!entity.hintShown && entity.stuckTimer >= (entity.stuckHintAfter ?? 20)) {
            entity.hintShown = true;
            this.emit('puzzle:hint', entity, { text: entity.hintText ?? 'Follow the glowing strands and pulse the next knot.', input: 'Shift · Warm Light', visualCue: entity.sequence, audioCue: 'soft-lantern-chime' });
          }
        } else if (!close) entity.stuckTimer = 0;
        if (pulsePressed && close) {
          if (entity.order === expectedOrder) {
            entity.cleared = true; entity.active = false; this.clearedKnots.add(entity.id);
            this.emit('knot:untangled', entity, { order: entity.order, sequence: entity.sequence, total: this.entities.filter((item) => item.type === 'thorn-knot').length });
          } else if (entity.order > expectedOrder) {
            this.emit('knot:sequence-reminder', entity, { expectedOrder, sequence: this.entities.find((item) => item.type === 'thorn-knot' && item.order === expectedOrder)?.sequence });
          }
        }
      }
      if (entity.type === 'crumbling-platform' && this.playerTouches(player, entity) && entity.crumbleTimer === null) entity.crumbleTimer = entity.crumbleDelay ?? 1;
      if (entity.type === 'crumbling-platform' && entity.crumbleTimer !== null) { entity.crumbleTimer -= step; if (entity.crumbleTimer <= 0) { entity.active = false; this.emit('platform:crumbled', entity); } }
      if (entity.type === 'enemy-spawner' && entity.active) {
        entity.spawnTimer = (entity.spawnTimer ?? entity.interval ?? 8) - step;
        if (entity.spawnTimer <= 0) { entity.spawnTimer = entity.interval ?? 8; this.emit('enemy:spawn-request', entity, { enemy: entity.enemy ?? 'shade' }); }
      }
      if (entity.type === 'switch' && entity.active && input.interactPressed && !entity.triggered && this.playerTouches(player, entity)) {
        entity.triggered = true; this.switches.add(entity.id); this.emit('switch:activated', entity);
        for (const target of this.entities.filter((item) => item.requiresSwitch === entity.id)) { target.active = true; if (target.type === 'door') target.open = true; this.emit('entity:unlocked', target, { switchId: entity.id }); }
      }
      if (entity.type === 'checkpoint' && this.playerTouches(player, entity) && player.checkpointId !== entity.id) {
        player.checkpointId = entity.id; player.checkpointX = entity.x; player.checkpointY = entity.y; this.emit('checkpoint:reached', entity, { checkpointId: entity.id });
      }
      if (entity.type === 'collectible' && !entity.collected) {
        const magnetDistance = distanceBetween(player, entity);
        if (magnetDistance < (entity.magnetRadius ?? 2.4) && magnetDistance > 0.3) {
          const magnetEase = Math.min(1, step * (entity.magnetStrength ?? 4.5));
          entity.x += (player.x + 0.15 - entity.x) * magnetEase;
          entity.y += (player.y + 0.7 - entity.y) * magnetEase;
        }
      }
      if (entity.type === 'collectible' && !entity.collected && this.playerTouches(player, entity)) {
        entity.collected = true; if (entity.kind === 'heart') player.heartsCollected = (player.heartsCollected ?? 0) + 1;
        this.emit('collectible:collected', entity, { kind: entity.kind });
      }
      if (['cutscene-trigger', 'dialogue-trigger'].includes(entity.type) && !entity.triggered && this.playerTouches(player, entity)) {
        entity.triggered = true;
        this.emit(entity.type === 'dialogue-trigger' ? 'dialogue:trigger' : 'cutscene:trigger', entity, { cutscene: entity.cutscene, dialogueId: entity.dialogueId, lines: entity.lines ?? [], skippable: entity.skippable ?? false });
      }
      if (['clock-hand', 'pendulum'].includes(entity.type) && this.playerTouches(player, entity) && !entity.contactCooldown) {
        entity.contactCooldown = 0.8;
        this.emit('hazard:contact', entity, { hazard: entity.type, gentle: true, rhythm: entity.period ?? 5 });
      }
      if (entity.type === 'spikes' && this.playerTouches(player, entity) && !entity.contactCooldown) {
        entity.contactCooldown = 0.8;
        this.emit('hazard:contact', entity, { hazard: 'spikes', gentle: true });
      }
      if (entity.contactCooldown > 0) entity.contactCooldown = Math.max(0, entity.contactCooldown - realStep);
      if (entity.restCooldown > 0) entity.restCooldown = Math.max(0, entity.restCooldown - realStep);
      if (entity.type === 'hazard' && entity.active && !entity.safe && this.playerTouches(player, entity)) {
        if (entity.kind === 'dark-mist' && input.pulseActive) { entity.cleared = true; entity.active = false; this.emit('hazard:cleared', entity); }
        else if (!entity.triggered) { entity.triggered = true; this.emit('hazard:contact', entity, { hazard: entity.kind }); }
      }
      if (entity.type === 'wind-zone' && this.playerTouches(player, entity)) player.velocityX += (entity.direction ?? 1) * (entity.strength ?? 0.4) * step;
      if (entity.type === 'spring' && entity.active && this.playerTouches(player, entity) && player.velocityY <= 0) { player.velocityY = entity.impulse ?? 11; player.grounded = false; player.jumpsUsed = 1; this.emit('spring:launched', entity); }
      if (entity.type === 'hint' && !this.completedHints.has(entity.skill) && this.playerTouches(player, entity)) this.emit('hint:show', entity, { skill: entity.skill, text: entity.text, input: entity.input });
    }
    this.lastPlayerX = player.x; return this.events;
  }

  getTimeScale() { return this.slowTimer > 0 ? this.slowScale : 1; }

  hitStop(duration = 0.05) { const safeDuration = Math.max(0, Math.min(0.12, Number(duration) || 0)); if (safeDuration <= 0) return; this.slowTimer = Math.max(this.slowTimer, safeDuration); this.slowScale = 0; }

  slowMoment(duration = 0.45, scale = 0.68) { this.slowTimer = Math.max(this.slowTimer, Math.max(0, Math.min(1.5, duration))); this.slowScale = Math.max(0.25, Math.min(1, Number(scale) || 0.68)); }

  hitStop(duration = 0.05) { const safeDuration = Math.max(0, Math.min(0.12, Number(duration) || 0)); if (safeDuration <= 0) return; this.slowTimer = Math.max(this.slowTimer, safeDuration); this.slowScale = 0; }

  resolveMirrorChoice(entityId, choiceId) {
    const entity = this.entities.find((item) => item.id === entityId && ['mirror', 'mirror-boss'].includes(item.type));
    if (!entity || entity.triggered) return false;
    const choice = (entity.choices ?? []).find((item) => item.id === choiceId);
    if (!choice) return false;
    if (entity.type === 'mirror-boss') {
      entity.answeredChoiceIds ??= [];
      if (entity.answeredChoiceIds.includes(choiceId)) return false;
      entity.answeredChoiceIds.push(choiceId);
    }
    const kind = choice.kind ?? 'kind';
    if (kind === 'kind') {
      if (entity.type === 'mirror-boss') {
        entity.cracks = Math.min(entity.requiredTruths ?? 3, entity.answeredChoiceIds.length);
        this.emit('mirror:boss-cracked', entity, { cracks: entity.cracks, requiredTruths: entity.requiredTruths ?? 3, truth: choice.label });
        if (entity.cracks >= (entity.requiredTruths ?? 3)) entity.triggered = true;
      } else {
        entity.triggered = true;
      }
      this.emit('mirror:answered', entity, { choiceId, kind, truth: entity.truth ?? 'Kindness is a truth, too.' });
    } else {
      this.emit('mirror:answered', entity, { choiceId, kind, truth: 'Try a kinder answer; there is no penalty for choosing again.' });
    }
    return true;
  }

  playerTouches(player, entity) {
    const p = { x: player.x - 0.3, y: player.y, width: 0.6, height: 1.65 };
    return overlaps(p, { x: entity.x, y: entity.y, width: entity.width ?? 0.7, height: entity.height ?? 1 });
  }

  markSkillUsed(skill) {
    if (this.completedHints.has(skill)) return; this.completedHints.add(skill);
    const hint = this.entities.find((item) => item.type === 'hint' && item.skill === skill);
    if (hint) this.emit('hint:fade', hint, { skill });
  }

  getPlatforms() {
    return this.entities.filter((entity) => entity.active && ['static-platform', 'moving-platform', 'crumbling-platform', 'one-way-platform', 'light-bridge'].includes(entity.type))
      .map((entity) => ({ x: entity.x + entity.width / 2, y: entity.y + entity.height, width: entity.width, surface: entity.surface ?? 'stone', oneWay: entity.type === 'one-way-platform', id: entity.id }));
  }

  getSnapshot() {
    return { id: this.level.id, title: this.level.title, world: clone(this.level.world ?? {}), theme: clone(this.level.theme ?? {}), difficultyCurve: clone(this.level.difficultyCurve ?? []), parallax: clone(this.level.parallax ?? []), entities: this.entities.map((entity) => ({ ...entity })), switches: [...this.switches], clearedKnots: [...this.clearedKnots], elapsed: this.elapsed };
  }

  hotReload(level) {
    const preserved = new Set(this.entities.filter((entity) => entity.collected).map((entity) => entity.id));
    this.load(level); for (const entity of this.entities) if (preserved.has(entity.id) && entity.type === 'collectible') entity.collected = true;
    this.emit('level:reloaded', null, { levelId: this.level.id });
  }
}

export function createLevelManager(level, options) { return new LevelManager(level, options); }
