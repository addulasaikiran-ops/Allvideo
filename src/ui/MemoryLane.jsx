import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { personalConfig } from '../story/personal.config.js';
import styles from './MemoryLane.module.css';

const scenes = personalConfig.memoryScenes ?? [];

function makeIllustrationTexture(scene) {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 340;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 480, 340);
  gradient.addColorStop(0, scene.accent ?? '#e8c8f4');
  gradient.addColorStop(1, '#29243e');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 480, 340);
  context.fillStyle = 'rgba(255,255,255,.12)';
  context.beginPath();
  context.arc(240, 145, 104, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#fff4df';
  context.font = '600 25px system-ui, sans-serif';
  context.textAlign = 'center';
  context.fillText(scene.title, 240, 265, 410);
  context.font = '16px system-ui, sans-serif';
  context.fillStyle = 'rgba(255,248,240,.82)';
  context.fillText('A memory, kept gently', 240, 296);
  if (scene.illustration === 'meeting') {
    context.fillStyle = '#352744';
    context.beginPath(); context.arc(190, 155, 31, 0, Math.PI * 2); context.fill();
    context.beginPath(); context.arc(282, 155, 31, 0, Math.PI * 2); context.fill();
    context.fillRect(164, 190, 52, 62); context.fillRect(256, 190, 52, 62);
    context.strokeStyle = '#fff4df'; context.lineWidth = 5;
    context.beginPath(); context.moveTo(216, 205); context.quadraticCurveTo(240, 180, 256, 205); context.stroke();
  } else if (scene.illustration === 'rain') {
    context.strokeStyle = 'rgba(235,247,255,.8)'; context.lineWidth = 4;
    for (let i = 0; i < 11; i += 1) { context.beginPath(); context.moveTo(40 + i * 39, 25); context.lineTo(18 + i * 39, 88); context.stroke(); }
    context.fillStyle = '#4b365d'; context.beginPath(); context.arc(240, 145, 78, Math.PI, 0); context.lineTo(318, 153); context.lineTo(162, 153); context.fill();
    context.strokeStyle = '#fff0d7'; context.lineWidth = 7; context.beginPath(); context.moveTo(240, 145); context.lineTo(240, 240); context.stroke();
  } else if (scene.illustration === 'meal') {
    context.fillStyle = '#6c4c44'; context.fillRect(100, 174, 280, 20);
    context.fillStyle = '#fff4df'; context.beginPath(); context.ellipse(240, 160, 78, 27, 0, 0, Math.PI * 2); context.fill();
    context.fillStyle = '#e9b77e'; context.beginPath(); context.ellipse(240, 157, 55, 18, 0, 0, Math.PI * 2); context.fill();
    context.fillStyle = '#6b9b75'; context.beginPath(); context.arc(220, 154, 9, 0, Math.PI * 2); context.fill(); context.beginPath(); context.arc(256, 163, 8, 0, Math.PI * 2); context.fill();
  } else {
    context.fillStyle = '#fff5d9';
    for (let i = 0; i < 26; i += 1) { const x = (i * 83 + 17) % 460 + 10; const y = (i * 47 + 19) % 190 + 10; context.beginPath(); context.arc(x, y, i % 4 === 0 ? 4 : 2, 0, Math.PI * 2); context.fill(); }
    context.fillStyle = '#29243e'; context.beginPath(); context.arc(242, 142, 48, 0, Math.PI * 2); context.fill();
    context.fillStyle = '#f1d7a7'; context.beginPath(); context.arc(260, 126, 42, 0, Math.PI * 2); context.fill();
    context.fillStyle = '#29243e'; context.beginPath(); context.arc(277, 115, 36, 0, Math.PI * 2); context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildScene(canvas, memory) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#201c35');
  scene.fog = new THREE.Fog('#201c35', 13, 28);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 3.2, 11.8);
  camera.lookAt(0, 1.5, 0);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  scene.add(new THREE.HemisphereLight('#d7e7ff', '#34233e', 2));
  const glow = new THREE.PointLight(memory.accent ?? '#ffd6a0', 22, 15);
  glow.position.set(-2, 5, 4); scene.add(glow);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 48), new THREE.MeshStandardMaterial({ color: '#35304a', roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.08; scene.add(floor);
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 3.25, 0.38, 48), new THREE.MeshStandardMaterial({ color: '#51435f', roughness: 0.7 }));
  plinth.position.y = 0.12; scene.add(plinth);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.045, 8, 64), new THREE.MeshBasicMaterial({ color: memory.accent ?? '#ffd6a0' }));
  rim.rotation.x = Math.PI / 2; rim.position.y = 0.34; scene.add(rim);

  const propMaterial = (color, emissive = '#000000') => new THREE.MeshStandardMaterial({ color, roughness: 0.75, emissive, emissiveIntensity: 0.35 });
  const sphere = (x, y, z, radius, color) => {
    const object = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 14), propMaterial(color));
    object.position.set(x, y, z); scene.add(object); return object;
  };
  const box = (x, y, z, w, h, d, color) => {
    const object = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), propMaterial(color));
    object.position.set(x, y, z); scene.add(object); return object;
  };
  if (memory.illustration === 'meeting') {
    sphere(-0.72, 1.35, 0.1, 0.38, '#e8bd9d'); sphere(0.72, 1.35, 0.1, 0.38, '#d9a8bd');
    box(-0.72, 0.83, 0.1, 0.55, 0.8, 0.42, '#9f82b9'); box(0.72, 0.83, 0.1, 0.55, 0.8, 0.42, '#719b91');
    const heart = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.07, 8, 24), new THREE.MeshBasicMaterial({ color: memory.accent }));
    heart.position.set(0, 1.45, 0.3); scene.add(heart);
  } else if (memory.illustration === 'rain') {
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.12, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), propMaterial('#6e94b4'));
    canopy.position.set(0, 2.15, 0); scene.add(canopy);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.7, 8), propMaterial('#d9c3a3'));
    stem.position.set(0, 1.35, 0.12); scene.add(stem);
    sphere(-0.45, 0.92, 0.15, 0.27, '#e8bd9d'); sphere(0.45, 0.92, 0.15, 0.27, '#d9a8bd');
    for (let i = 0; i < 13; i += 1) { const drop = box(-2 + (i % 7) * 0.65, 2.3 + (i % 3) * 0.3, -0.3, 0.025, 0.3, 0.025, '#9ccfe0'); drop.rotation.z = -0.22; }
  } else if (memory.illustration === 'meal') {
    box(0, 0.85, 0, 2.5, 0.18, 1.35, '#9d735b');
    for (const x of [-0.7, 0.7]) box(x, 0.52, 0, 0.12, 0.62, 0.12, '#9d735b');
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.07, 32), propMaterial('#f5ead9')); plate.position.set(0, 1, 0); scene.add(plate);
    sphere(-0.18, 1.13, 0.08, 0.16, '#d9a76f'); sphere(0.16, 1.13, -0.06, 0.17, '#71966d'); sphere(0.08, 1.13, 0.19, 0.12, '#bd8069');
    sphere(-0.9, 1.28, 0, 0.23, '#e8bd9d'); sphere(0.9, 1.28, 0, 0.23, '#d9a8bd');
  } else {
    for (let i = 0; i < 30; i += 1) { const star = sphere(-2.5 + (i * 37 % 50) / 10, 1.7 + (i * 23 % 28) / 10, -1.5, 0.035 + (i % 3) * 0.018, '#fff0c2'); star.userData.twinkle = i * 0.45; }
    const telescope = box(-1.15, 1.15, 0, 0.22, 1.35, 0.22, '#b8a8ed'); telescope.rotation.z = -0.45;
    const scope = box(-0.9, 1.68, 0, 1, 0.2, 0.2, '#c9c4df'); scope.rotation.z = -0.45;
    sphere(0.6, 0.78, 0.15, 0.28, '#e8bd9d'); sphere(1.1, 0.78, 0.15, 0.28, '#d9a8bd');
  }

  const frame = new THREE.Mesh(new THREE.PlaneGeometry(2.25, 2.85), new THREE.MeshStandardMaterial({ color: '#fff7e9', roughness: 0.88 }));
  frame.position.set(2.35, 2.35, 0.72); frame.rotation.y = -0.13; scene.add(frame);
  const fallback = makeIllustrationTexture(memory);
  const photoMaterial = new THREE.MeshBasicMaterial({ map: fallback, side: THREE.DoubleSide });
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 1.78), photoMaterial);
  photo.position.set(2.35, 2.58, 0.77); photo.rotation.y = -0.13; scene.add(photo);
  if (memory.photo) {
    new THREE.TextureLoader().load(memory.photo, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      if (renderer.domElement.isConnected) {
        photoMaterial.map = texture; photoMaterial.needsUpdate = true; fallback.dispose();
      } else texture.dispose();
    }, undefined, () => {
      // Keep the illustrated CanvasTexture when the personal photo is absent or unreadable.
    });
  }
  const label = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.06), new THREE.MeshBasicMaterial({ color: memory.accent ?? '#ffd6a0' }));
  label.position.set(2.35, 1.54, 0.78); label.rotation.y = -0.13; scene.add(label);

  const resize = () => {
    const width = Math.max(1, canvas.clientWidth); const height = Math.max(1, canvas.clientHeight);
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
  };
  resize();
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  let frameId = 0;
  const start = performance.now();
  const animate = (now) => {
    frameId = requestAnimationFrame(animate);
    const elapsed = (now - start) / 1000;
    rim.rotation.z = elapsed * 0.08;
    scene.traverse((object) => { if (object.userData.twinkle) object.scale.setScalar(0.8 + Math.sin(elapsed * 1.7 + object.userData.twinkle) * 0.2); });
    renderer.render(scene, camera);
  };
  frameId = requestAnimationFrame(animate);
  return () => {
    cancelAnimationFrame(frameId); observer.disconnect();
    scene.traverse((object) => {
      object.geometry?.dispose();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
      else object.material?.dispose();
    });
    fallback.dispose(); renderer.dispose();
  };
}

export function MemoryLane({ onExit }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [collectedIds, setCollectedIds] = useState([]);
  const [screen, setScreen] = useState('walk');
  const [intro, setIntro] = useState(true);
  const canvasRef = useRef(null);
  const current = scenes[sceneIndex];
  const collected = useMemo(() => scenes.filter((scene) => collectedIds.includes(scene.id)), [collectedIds]);

  useEffect(() => {
    if (screen !== 'walk' || intro || !current || !canvasRef.current) return undefined;
    return buildScene(canvasRef.current, current);
  }, [current, intro, screen]);

  if (!scenes.length) {
    return <section className={styles.panel}><h2>Memory Lane</h2><p>Add scenes to <code>memoryScenes</code> in personal.config.js to begin.</p><button type="button" onClick={onExit}>Return to chapters</button></section>;
  }

  const collect = () => {
    setCollectedIds((ids) => ids.includes(current.id) ? ids : [...ids, current.id]);
    setScreen('gallery');
  };
  const revisit = (id) => {
    const index = scenes.findIndex((scene) => scene.id === id);
    if (index >= 0) { setSceneIndex(index); setIntro(false); setScreen('walk'); }
  };

  return (
    <section className={styles.panel} aria-label="Chapter 6 Memory Lane">
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>CHAPTER SIX · A QUIET WALK</p><h2>Memory Lane</h2><p>There is no hurry here. Stay with a moment, or skip ahead.</p></div>
        <button className={styles.quietButton} type="button" onClick={onExit}>Skip walk ↗</button>
      </header>
      <nav className={styles.tabs} aria-label="Memory Lane screens">
        <button type="button" className={screen === 'walk' ? styles.activeTab : ''} onClick={() => { setScreen('walk'); setIntro(false); }}>Walk through memories</button>
        <button type="button" className={screen === 'gallery' ? styles.activeTab : ''} onClick={() => setScreen('gallery')}>Memory Gallery ({collected.length})</button>
      </nav>
      {screen === 'walk' && (
        intro ? (
          <div className={styles.intro}>
            <div className={styles.orb} aria-hidden="true">✧</div>
            <p className={styles.eyebrow}>TAKE YOUR TIME</p><h3>Little moments, held in light.</h3>
            <p>Walk through four tiny worlds. Collect a glowing fragment to keep a scene in your gallery. You can leave whenever you like.</p>
            <div className={styles.actions}><button type="button" onClick={() => setIntro(false)}>Begin the walk</button><button className={styles.quietButton} type="button" onClick={onExit}>Skip this chapter</button></div>
          </div>
        ) : (
          <div className={styles.walkLayout}>
            <div className={styles.diorama}><canvas ref={canvasRef} aria-label={`Three-dimensional memory diorama: ${current.title}`} /><span className={styles.sceneBadge}>✦ {sceneIndex + 1} / {scenes.length}</span></div>
            <article className={styles.caption}>
              <p className={styles.eyebrow}>{current.date || 'A DAY TO KEEP'}</p><h3>{current.title}</h3><p>{current.caption}</p><p className={styles.detail}>{current.detail}</p>
              <div className={styles.actions}>
                <button type="button" onClick={collect}>{collectedIds.includes(current.id) ? 'Visit in Memory Gallery' : 'Collect memory fragment ✦'}</button>
                <button className={styles.quietButton} type="button" disabled={sceneIndex === 0} onClick={() => setSceneIndex((index) => Math.max(0, index - 1))}>Previous</button>
                <button className={styles.quietButton} type="button" onClick={() => { if (sceneIndex === scenes.length - 1) setScreen('gallery'); else setSceneIndex((index) => index + 1); }}>{sceneIndex === scenes.length - 1 ? 'Open gallery' : 'Continue the walk →'}</button>
              </div>
              <p className={styles.progress}>{collected.length} of {scenes.length} fragments collected</p>
            </article>
          </div>
        )
      )}
      {screen === 'gallery' && (
        <div className={styles.gallery}>
          <div className={styles.galleryHeading}><h3>Your Memory Gallery</h3><p>Collected fragments stay here for this visit. Select one to revisit its diorama and words.</p></div>
          {collected.length === 0 ? <div className={styles.empty}><span aria-hidden="true">✧</span><p>No fragments yet. Take a gentle walk and collect a memory to begin your gallery.</p><button type="button" onClick={() => { setScreen('walk'); setIntro(false); }}>Return to the walk</button></div> : (
            <div className={styles.cards}>{collected.map((memory) => (
              <button className={styles.memoryCard} type="button" key={memory.id} onClick={() => revisit(memory.id)}>
                <span className={styles.cardArt} style={{ '--memory-accent': memory.accent }}>
                  <span aria-hidden="true">{memory.illustration === 'rain' ? '☂' : memory.illustration === 'meal' ? '♡' : memory.illustration === 'stars' ? '✦' : '✧'}</span>
                  {memory.photo && <img className={styles.cardPhoto} src={memory.photo} alt={`Photo for ${memory.title}`} onError={(event) => { event.currentTarget.hidden = true; }} />}
                </span>
                <span className={styles.cardTitle}>{memory.title}</span><span className={styles.cardDate}>{memory.date || 'A day to keep'}</span><span className={styles.cardCaption}>{memory.caption}</span>
                {memory.photo && <span className={styles.photoPath}>Photo: {memory.photo}</span>}
              </button>
            ))}</div>
          )}
        </div>
      )}
      <footer className={styles.footer}><span>Photos stay in /public/personal; missing photos become illustrations.</span><span>{collected.length}/{scenes.length} kept</span></footer>
    </section>
  );
}
