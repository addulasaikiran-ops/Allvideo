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

  const ground = new THREE.Mesh(new THREE.BoxGeometry(40, 1, 5), makeMaterial('#39314f'));
  ground.position.set(6, -0.65, 0);
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
    scene.add(platform);
    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.96, 0.045, 2.25),
      new THREE.MeshBasicMaterial({ color: '#f5c78d' }),
    );
    glow.position.set(x, y + 0.18, 0.1);
    scene.add(glow);
  });

  const player = new THREE.Group();
  const skin = makeMaterial('#f3c8a8');
  const cloak = makeMaterial('#d79bbd');
  const hair = makeMaterial('#3c294a');
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.55, 4, 8), cloak);
  body.position.y = 0.85;
  player.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.29, 12, 10), skin);
  head.position.set(0.02, 1.48, 0.02);
  player.add(head);
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.62), hair);
  hairCap.position.set(0.02, 1.57, 0.04);
  player.add(hairCap);
  const lantern = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 10, 8),
    new THREE.MeshBasicMaterial({ color: '#ffe7a4' }),
  );
  lantern.position.set(0.52, 1.05, 0.45);
  player.add(lantern);
  const lanternLight = new THREE.PointLight('#ffcb7d', 2.5, 5);
  lanternLight.position.copy(lantern.position);
  player.add(lanternLight);
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

  function render({ player: playerState, deltaSeconds = 0 } = {}) {
    if (playerState) {
      player.position.x = playerState.x;
      player.position.y = playerState.y;
      player.rotation.z = playerState.respawnFlash > 0 ? Math.sin(performance.now() * 0.025) * 0.04 : 0;
      camera.position.x += (playerState.x + 1 - camera.position.x) * Math.min(deltaSeconds * 2.8, 1);
      camera.lookAt(camera.position.x, 2, 0);
    }
    const level = quality.sample(deltaSeconds);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, level === 'low' ? 0.75 : level === 'medium' ? 1 : 1.5));
    renderer.render(scene, camera);
  }

  function destroy() {
    resizeObserver.disconnect();
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
