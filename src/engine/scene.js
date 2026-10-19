import * as THREE from 'three';
import { createQualityScaler } from './quality.js';

function makeMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...options });
}

export function createWorldScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1c1b35');
  scene.fog = new THREE.Fog('#1c1b35', 20, 52);

  const camera = new THREE.OrthographicCamera(-10, 10, 6, -6, 0.1, 100);
  camera.position.set(0, 6, 18);
  camera.lookAt(0, 2, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = false;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  scene.add(new THREE.HemisphereLight('#c4d8ff', '#3a2748', 2.1));
  const moonlight = new THREE.DirectionalLight('#ffe0b1', 2.2);
  moonlight.position.set(-4, 10, 8);
  scene.add(moonlight);

  const stars = new THREE.Group();
  const starMaterial = new THREE.MeshBasicMaterial({ color: '#f9dfb0', transparent: true, opacity: 0.8 });
  for (let i = 0; i < 90; i += 1) {
    const star = new THREE.Mesh(new THREE.SphereGeometry(0.025 + Math.random() * 0.035, 6, 6), starMaterial);
    star.position.set(-22 + Math.random() * 44, 2 + Math.random() * 15, -8 - Math.random() * 12);
    stars.add(star);
  }
  scene.add(stars);

  const farIslands = new THREE.Group();
  const islandMaterial = makeMaterial('#454065');
  for (let i = 0; i < 8; i += 1) {
    const island = new THREE.Mesh(new THREE.ConeGeometry(2.8 + (i % 3), 2.2, 5), islandMaterial);
    island.position.set(-20 + i * 6.2, -1.2 + (i % 3) * 1.1, -7);
    island.rotation.y = Math.PI / 5;
    island.rotation.z = Math.PI;
    farIslands.add(island);
  }
  scene.add(farIslands);
  const foregroundGrass = new THREE.Group();
  const grassMaterial = new THREE.MeshBasicMaterial({ color: '#5e7c68', transparent: true, opacity: 0.55 });
  for (let i = 0; i < 70; i += 1) { const blade = new THREE.Mesh(new THREE.ConeGeometry(.08 + (i % 3) * .02, .65 + (i % 4) * .12, 4), grassMaterial); blade.position.set(-18 + i * .58, -.15, 2.8); blade.rotation.z = (i % 2 ? -.18 : .18); foregroundGrass.add(blade); }
  scene.add(foregroundGrass);

  const ground = new THREE.Mesh(new THREE.BoxGeometry(40, 1, 5), makeMaterial('#39314f'));
  ground.position.set(6, -0.65, 0);
  ground.visible = false;
  scene.add(ground);

  const platformMaterial = makeMaterial('#665174');
  const platforms = [
    { x: -2, y: 0.25, width: 3.5 },
    { x: 4, y: 1.2, width: 2.5 },
    { x: 8.5, y: 0.45, width: 3 },
    { x: 13, y: 1.35, width: 2.8 },
    { x: 18, y: 0.5, width: 4 },
  ];
  platforms.forEach(({ x, y, width }) => {
    const platform = new THREE.Mesh(new THREE.BoxGeometry(width, 0.32, 2.2), platformMaterial);
    platform.position.set(x, y, 0.1);
    platform.visible = false;
    scene.add(platform);
    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.96, 0.045, 2.25),
      new THREE.MeshBasicMaterial({ color: '#f5c78d' }),
    );
    glow.position.set(x, y + 0.18, 0.1);
    glow.visible = false;
    scene.add(glow);
  });

  const player = new THREE.Group();
  const visualParts = {};
  const skin = makeMaterial('#f3c8a8');
  const cloak = makeMaterial('#d79bbd');
  const hair = makeMaterial('#3c294a');
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.55, 4, 8), cloak);
  body.position.y = 0.85;
  player.add(body); visualParts.body = body;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.29, 12, 10), skin);
  head.position.set(0.02, 1.48, 0.02);
  player.add(head); visualParts.head = head;
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.62), hair);
  hairCap.position.set(0.02, 1.57, 0.04);
  player.add(hairCap); visualParts.hair = hairCap;
  const lantern = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 10, 8),
    new THREE.MeshBasicMaterial({ color: '#ffe7a4' }),
  );
  lantern.position.set(0.52, 1.05, 0.45);
  player.add(lantern); visualParts.lantern = lantern;
  const lanternLight = new THREE.PointLight('#ffcb7d', 2.5, 5);
  lanternLight.position.copy(lantern.position);
  player.add(lanternLight); visualParts.lanternLight = lanternLight;
  const trailGlow = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 10), new THREE.MeshBasicMaterial({ color: '#ffe4a3', transparent: true, opacity: 0.16, depthWrite: false }));
  trailGlow.position.set(-0.24, 0.55, -0.1); player.add(trailGlow); visualParts.trailGlow = trailGlow;
  const pulseRing = new THREE.Mesh(new THREE.RingGeometry(0.92, 1, 40), new THREE.MeshBasicMaterial({ color: '#fff0b7', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
  pulseRing.position.set(0, 0.9, 0.72); scene.add(pulseRing);
  const armMaterial = makeMaterial('#d79bbd');
  const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.28, 3, 6), armMaterial);
  const rightArm = leftArm.clone();
  leftArm.position.set(-0.31, 0.92, 0.08); rightArm.position.set(0.32, 0.92, 0.08);
  player.add(leftArm, rightArm); visualParts.leftArm = leftArm; visualParts.rightArm = rightArm;
  const dustParticles = [];
  let lastDustEvent = null;
  player.position.set(-6, 0, 0.6);
  scene.add(player);

  const checkpointMarkers = new THREE.Group();
  [2, 12].forEach((x, index) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.8, 6), makeMaterial('#c8b1db'));
    pole.position.set(x, 0.9, 0.5);
    checkpointMarkers.add(pole);
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 10, 8),
      new THREE.MeshBasicMaterial({ color: index === 0 ? '#b9f2d0' : '#ffdc9c' }),
    );
    orb.position.set(x, 1.9, 0.5);
    checkpointMarkers.add(orb);
  });
  scene.add(checkpointMarkers);
  // Feel-test lane: close, medium, long, high, and double-jump targets.
  const feelPlatforms = [
    { x: 22, y: .55, width: 2.2 }, { x: 26, y: .85, width: 1.8 },
    { x: 30.8, y: .65, width: 1.7 }, { x: 36, y: 1.6, width: 2 },
    { x: 42.2, y: 1.1, width: 1.8 }, { x: 47.5, y: 2.1, width: 2.1 }, { x: 52, y: .6, width: 2.4 },
  ];
  const testLane = new THREE.Group();
  feelPlatforms.forEach((p, i) => {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(p.width, .32, 2.2), makeMaterial(['#6a5a82', '#5b786e', '#866d62', '#7771a0'][i % 4]));
    slab.position.set(p.x, p.y - .16, .1); testLane.add(slab);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(p.width * .94, .045, 2.24), new THREE.MeshBasicMaterial({ color: '#f8d9a2' }));
    edge.position.set(p.x, p.y + .015, .1); testLane.add(edge);
  });
  scene.add(testLane);

  const levelVisuals = new THREE.Group();
  scene.add(levelVisuals);
  const ambientParticles = new THREE.Group();
  const ambientMeshes = [];
  for (let i = 0; i < 100; i += 1) {
    const particle = new THREE.Mesh(new THREE.SphereGeometry(.035 + (i % 3) * .012, 5, 4), new THREE.MeshBasicMaterial({ color: '#a6d8bf', transparent: true, opacity: .62, depthWrite: false }));
    particle.position.set(-20 + Math.random() * 40, -0.2 + Math.random() * 10, -2 + Math.random() * 3);
    particle.userData = { phase: Math.random() * Math.PI * 2, drift: .15 + Math.random() * .3 };
    ambientParticles.add(particle); ambientMeshes.push(particle);
  }
  scene.add(ambientParticles);
  const levelVisualById = new Map();
  const colliderVisuals = new THREE.Group();
  colliderVisuals.visible = false;
  scene.add(colliderVisuals);
  const levelPalette = {
    'static-platform': '#665174', 'moving-platform': '#719b91', 'crumbling-platform': '#ad8b73', 'light-bridge': '#a8f1e2', 'thorn-knot': '#b06f8e', 'enemy': '#9cc5ff', 'dialogue-trigger': '#a8f1e2',
    'one-way-platform': '#8cae9a', 'hazard': '#7d405e', 'switch': '#e8c77d', 'door': '#806d9f',
    'checkpoint': '#b9f2d0', 'spring': '#f5c78d', 'collectible': '#ffe7a4', 'hint': '#f3d9a5',
    'wind-zone': '#a4d7ed', 'enemy-spawner': '#9d83b5', 'cutscene-trigger': '#fff0b7', 'camera-zone': '#9ba6dc',
  };
  function makeLevelVisual(entity) {
    const group = new THREE.Group();
    let geometry;
    let material = new THREE.MeshStandardMaterial({ color: levelPalette[entity.type] ?? '#8a7d9f', roughness: 0.72 });
    if (['static-platform', 'moving-platform', 'crumbling-platform', 'one-way-platform', 'light-bridge'].includes(entity.type)) {
      geometry = new THREE.BoxGeometry(entity.width, entity.height, 2.2);
      const slab = new THREE.Mesh(geometry, material);
      slab.position.y = entity.height / 2;
      group.add(slab);
      const edge = new THREE.Mesh(new THREE.BoxGeometry(entity.width * .96, .045, 2.24), new THREE.MeshBasicMaterial({ color: entity.type === 'light-bridge' ? (entity.bridgeGlow ?? '#a8f1e2') : '#f8dfb5', transparent: entity.type === 'light-bridge', opacity: entity.type === 'light-bridge' ? .9 : 1 }));
      edge.position.set(0, entity.height + .015, 0);
      group.add(edge);
    } else if (entity.type === 'thorn-knot') {\n      const vineMaterial = new THREE.MeshStandardMaterial({ color: entity.cleared ? '#8ed7b5' : '#b06f8e', roughness: .45, emissive: entity.cleared ? '#315e4b' : '#301d39' });\n      for (let i = 0; i < 3; i += 1) { const vine = new THREE.Mesh(new THREE.TorusGeometry(.24 + i * .12, .045, 6, 18), vineMaterial); vine.position.set((i - 1) * .08, .55 + i * .25, .12); vine.rotation.x = Math.PI / 2; vine.rotation.z = i * .8; group.add(vine); }\n      const core = new THREE.Mesh(new THREE.OctahedronGeometry(.18, 1), new THREE.MeshBasicMaterial({ color: entity.cleared ? '#8ed7b5' : (entity.sequence === 'amber' ? '#f3c889' : entity.sequence === 'teal' ? '#8ce3d6' : '#e9a9d0') })); core.position.set(0, .9, .22); group.add(core);\n    } else if (entity.type === 'enemy') {\n      const wisp = new THREE.Mesh(new THREE.SphereGeometry(.34, 12, 10), new THREE.MeshBasicMaterial({ color: entity.enemy === 'spark-wisp' ? '#9cecff' : '#c8b5ff', transparent: true, opacity: entity.calmTimer > 0 ? .48 : .88 })); wisp.position.y = .45; group.add(wisp);\n      const glow = new THREE.Mesh(new THREE.SphereGeometry(.5, 12, 8), new THREE.MeshBasicMaterial({ color: entity.calmTimer > 0 ? '#b9f2d0' : '#a9baff', transparent: true, opacity: .16, depthWrite: false })); glow.position.y = .45; group.add(glow);\n    } else if (entity.type === 'collectible') {
      geometry = new THREE.OctahedronGeometry(.28, 1);
      const gem = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: entity.kind === 'heart' ? '#ff9eae' : '#ffe7a4' }));
      gem.position.y = entity.height / 2;
      group.add(gem);
      const aura = new THREE.Mesh(new THREE.SphereGeometry(.42, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffe7a4', transparent: true, opacity: .12, depthWrite: false }));
      aura.position.y = entity.height / 2; group.add(aura);
    } else if (entity.type === 'dialogue-trigger') {\n      const bottle = new THREE.Mesh(new THREE.CapsuleGeometry(.14, .42, 3, 6), new THREE.MeshBasicMaterial({ color: '#a8f1e2' })); bottle.position.y = .45; bottle.rotation.z = -.22; group.add(bottle);\n      const glow = new THREE.Mesh(new THREE.SphereGeometry(.38, 10, 8), new THREE.MeshBasicMaterial({ color: '#a8f1e2', transparent: true, opacity: .15, depthWrite: false })); glow.position.y = .45; group.add(glow);\n    } else if (entity.type === 'checkpoint') {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, entity.height, 6), material);
      pole.position.y = entity.height / 2; group.add(pole);
      const orb = new THREE.Mesh(new THREE.SphereGeometry(.18, 10, 8), new THREE.MeshBasicMaterial({ color: '#b9f2d0' }));
      orb.position.y = entity.height + .1; group.add(orb);
    } else if (entity.type === 'spring') {
      const spring = new THREE.Mesh(new THREE.TorusGeometry(.28, .09, 8, 16), material);
      spring.position.y = .18; group.add(spring);
    } else {
      const opacity = ['hazard', 'wind-zone', 'camera-zone', 'hint', 'cutscene-trigger'].includes(entity.type) ? .25 : 1;
      material.transparent = opacity < 1; material.opacity = opacity; material.depthWrite = opacity === 1;
      geometry = new THREE.BoxGeometry(entity.width ?? .7, entity.height ?? 1, .3);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = (entity.height ?? 1) / 2; group.add(mesh);
      if (entity.type === 'switch' || entity.type === 'door' || entity.type === 'hint') {
        const orb = new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffe7a4' }));
        orb.position.set(0, (entity.height ?? 1) + .12, .15); group.add(orb);
      }
    }
    group.position.set(entity.x ?? 0, entity.y ?? 0, entity.type === 'wind-zone' || entity.type === 'camera-zone' ? -1 : .2);
    levelVisuals.add(group);
    const colliderMaterial = new THREE.MeshBasicMaterial({ color: '#7dffd6', wireframe: true, transparent: true, opacity: .8, depthTest: false });
    const collider = new THREE.Mesh(new THREE.BoxGeometry(entity.width ?? .7, entity.height ?? 1, .15), colliderMaterial);
    collider.position.set((entity.x ?? 0) + (entity.width ?? .7) / 2, (entity.y ?? 0) + (entity.height ?? 1) / 2, 1.2);
    colliderVisuals.add(collider);
    return { group, collider };
  }
  function syncLevel(snapshot, debug) {
    colliderVisuals.visible = Boolean(debug);
    const entities = snapshot?.entities ?? [];
    const activeIds = new Set(entities.map((entity) => entity.id));
    for (const entity of entities) {
      let visual = levelVisualById.get(entity.id);
      if (!visual) { visual = makeLevelVisual(entity); levelVisualById.set(entity.id, visual); }
      visual.group.position.set(entity.x ?? 0, entity.y ?? 0, entity.type === 'wind-zone' || entity.type === 'camera-zone' ? -1 : .2);\n      if (entity.type === 'thorn-knot') visual.group.children.forEach((child) => { if (child.material?.color) child.material.color.set(entity.cleared ? '#8ed7b5' : (entity.sequence === 'amber' ? '#f3c889' : entity.sequence === 'teal' ? '#8ce3d6' : '#e9a9d0')); });\n      if (entity.type === 'enemy') visual.group.children.forEach((child) => { if (child.material?.opacity !== undefined) child.material.opacity = entity.calmTimer > 0 ? .38 : .85; });
      visual.group.visible = entity.active !== false && !entity.collected && !entity.cleared && !(entity.type === 'door' && entity.open);
      visual.collider.visible = Boolean(debug && entity.width && entity.height);
      visual.collider.position.set((entity.x ?? 0) + (entity.width ?? .7) / 2, (entity.y ?? 0) + (entity.height ?? 1) / 2, 1.2);
    }
    for (const [id, visual] of levelVisualById) {
      if (!activeIds.has(id)) { levelVisuals.remove(visual.group); colliderVisuals.remove(visual.collider); levelVisualById.delete(id); }
    }
  }

  const quality = createQualityScaler();
  const resizeObserver = new ResizeObserver(() => {
    const { width, height } = canvas.getBoundingClientRect();
    if (width < 1 || height < 1) return;
    const aspect = width / height;
    const viewHeight = 12;
    camera.left = -(viewHeight * aspect) / 2;
    camera.right = (viewHeight * aspect) / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  });
  resizeObserver.observe(canvas);

  let cameraDip = 0;
  function render({ player: playerState, deltaSeconds = 0, state } = {}) {\n    syncLevel(state?.levelSnapshot, state?.levelDebug);\n    const theme = state?.levelSnapshot?.theme ?? {};\n    if (theme.background) scene.background.set(theme.background);\n    if (theme.fog) scene.fog.color.set(theme.fog);\n    if (theme.particle) ambientMeshes.forEach((particle) => particle.material.color.set(theme.particle));\n    ambientParticles.visible = Boolean(theme.particleStyle);
    if (playerState) {
      const t = performance.now() / 1000;
      player.position.x = playerState.x; player.position.y = playerState.y;
      player.rotation.z = playerState.respawnFlash > 0 ? Math.sin(t * 24) * 0.045 : 0;
      visualParts.hair.rotation.z = Math.sin(t * 2.8) * 0.035 + (playerState.animationState === 'run' ? Math.sin(t * 13) * 0.055 : 0);
      visualParts.head.rotation.y = Math.sin(t * 0.75) * 0.035;
      visualParts.body.rotation.z = playerState.animationState === 'victory' ? -0.08 : playerState.animationState === 'hurt' ? 0.09 : playerState.animationState === 'rest' ? Math.sin(t * 2) * 0.018 : 0;
      visualParts.leftArm.rotation.z = playerState.animationState === 'victory' ? -1.05 : playerState.animationState === 'run' ? Math.sin(t * 14) * 0.35 : playerState.animationState === 'rest' ? -0.15 : 0;
      visualParts.rightArm.rotation.z = playerState.animationState === 'victory' ? 1.05 : playerState.animationState === 'run' ? -Math.sin(t * 14) * 0.35 : playerState.animationState === 'rest' ? 0.15 : 0;
      visualParts.head.position.x = 0.02 + (playerState.animationState === 'idle' && Math.sin(t * 1.6) > 0.8 ? 0.025 : 0);
      player.scale.set(playerState.squash ?? 1, playerState.stretch ?? 1, 1);
      player.scale.x *= playerState.animationState === 'run' ? 1 + Math.abs(Math.sin(t * 14)) * 0.025 : 1;
      visualParts.lantern.position.y = 1.05 + Math.sin(t * 3.2) * 0.045;
      visualParts.lanternLight.intensity = playerState.animationState === 'pulse' ? (playerState.pulseLightIntensity ?? 4.2) : 2.5;
      trailGlow.scale.setScalar(playerState.trailScale ?? 0.65);
      trailGlow.material.opacity = 0.11 + Math.min(0.16, (playerState.heartsCollected ?? 0) * 0.018);
      trailGlow.position.x = -0.24 - Math.abs(playerState.velocityX ?? 0) * 0.04;
      pulseRing.position.set(playerState.x, (playerState.y ?? 0) + 0.9, 0.72);
      const dustEvent = (playerState.events ?? []).find((event) => event.type === 'effects:dust');
      if (dustEvent && dustEvent !== lastDustEvent) {
        lastDustEvent = dustEvent;
        for (let i = 0; i < Math.min(dustEvent.count ?? 6, 12); i += 1) {
          const particle = new THREE.Mesh(new THREE.SphereGeometry(0.035 + (i % 3) * 0.012, 5, 4), new THREE.MeshBasicMaterial({ color: dustEvent.surface === 'moss' ? '#b9d8b6' : '#f2d4bb', transparent: true, opacity: 0.8 }));
          particle.position.set(playerState.x + (i - 3) * 0.09, (playerState.y ?? 0) + 0.08, 0.6 + (i % 2) * 0.08);
          scene.add(particle); dustParticles.push({ mesh: particle, age: 0, life: 0.32 + (i % 3) * 0.035 });
        }
      }
      for (let i = dustParticles.length - 1; i >= 0; i -= 1) {
        const dust = dustParticles[i]; dust.age += deltaSeconds; dust.mesh.position.y += deltaSeconds * 0.7;
        dust.mesh.material.opacity = Math.max(0, 0.8 * (1 - dust.age / dust.life));
        if (dust.age >= dust.life) { scene.remove(dust.mesh); dust.mesh.geometry.dispose(); dust.mesh.material.dispose(); dustParticles.splice(i, 1); }
      }
      if ((playerState.pulseRadius ?? 0) > 0) {
        pulseRing.scale.setScalar(Math.max(0.1, playerState.pulseRadius));
        pulseRing.material.opacity = Math.max(0, 0.65 * (1 - (playerState.pulseTimer ?? 0) / (playerState.pulseDuration ?? 0.42)));
      } else if ((playerState.respawnFlash ?? 0) > 0) {
        pulseRing.scale.setScalar(1 + (0.42 - playerState.respawnFlash) * 7);
        pulseRing.material.opacity = Math.min(0.55, playerState.respawnFlash * 1.4);
      } else pulseRing.material.opacity = 0;
      if ((playerState.landDip ?? 0) > 0) cameraDip = Math.max(cameraDip, playerState.landDip);
      else cameraDip = Math.max(0, cameraDip - deltaSeconds * 1.4);
      camera.position.x += (playerState.x + 1 - camera.position.x) * Math.min(deltaSeconds * 2.8, 1);
      ambientParticles.position.x = camera.position.x * .82;\n      ambientMeshes.forEach((particle) => { particle.position.y += Math.sin(t * particle.userData.drift + particle.userData.phase) * deltaSeconds * .18; particle.position.x += Math.cos(t * .2 + particle.userData.phase) * deltaSeconds * .12; });\n      const parallax = state?.levelSnapshot?.parallax ?? [];
      const layerSpeed = (id, fallback) => parallax.find((layer) => layer.id === id)?.speed ?? fallback;
      farIslands.position.x = camera.position.x * (1 - layerSpeed('distant-hills', .12));
      stars.position.x = camera.position.x * (1 - layerSpeed('morning-clouds', .24));
      foregroundGrass.position.x = camera.position.x * (1 - layerSpeed('foreground-grass', .82));
      camera.lookAt(camera.position.x, 2 - cameraDip, 0);
    }
    const level = quality.sample(deltaSeconds);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, level === 'low' ? 0.75 : level === 'medium' ? 1 : 1.5));
    renderer.render(scene, camera);
  }

  function destroy() {
    resizeObserver.disconnect();
    pulseRing.geometry.dispose(); pulseRing.material.dispose();
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    renderer.dispose();
  }

  return { render, destroy, renderer };
}
