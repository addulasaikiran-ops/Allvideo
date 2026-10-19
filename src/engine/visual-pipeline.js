import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';

export const CHAPTER_LOOKS = Object.freeze({
  'chapter-01': { background: '#1c1b35', fog: '#29243f', key: '#ffe0b1', rim: '#dca1c5', particle: '#f9dfb0', grade: [0.96, 0.91, 1.05], bloom: 0.42, fogNear: 18, fogFar: 54, particles: 'fireflies' },
  'chapter-02': { background: '#241b36', fog: '#39233f', key: '#f3c889', rim: '#e9a9d0', particle: '#b9f2d0', grade: [1.04, 0.91, 1.06], bloom: 0.5, fogNear: 13, fogFar: 42, particles: 'motes' },
  'chapter-03': { background: '#172b46', fog: '#29465b', key: '#a8e5e4', rim: '#d79bbd', particle: '#8ce3d6', grade: [0.88, 1.02, 1.12], bloom: 0.38, fogNear: 16, fogFar: 48, particles: 'water' },
  'chapter-04': { background: '#202846', fog: '#34394f', key: '#ffd49a', rim: '#d79bbd', particle: '#a4d7ed', grade: [0.98, 0.97, 1.08], bloom: 0.3, fogNear: 19, fogFar: 56, particles: 'rain' },
  'chapter-05': { background: '#29213d', fog: '#3b2b4d', key: '#fff1d1', rim: '#e9a9d0', particle: '#c8b5f2', grade: [1.03, 0.91, 1.1], bloom: 0.44, fogNear: 14, fogFar: 44, particles: 'motes' },
  'chapter-06': { background: '#294653', fog: '#3a5860', key: '#f5c78d', rim: '#ffb7c8', particle: '#ffb7c8', grade: [1.05, 0.98, 0.98], bloom: 0.52, fogNear: 18, fogFar: 56, particles: 'petals' },
  'chapter-07': { background: '#161c35', fog: '#252b48', key: '#ffe0a0', rim: '#9cc5ff', particle: '#9cc5ff', grade: [0.87, 0.9, 1.12], bloom: 0.34, fogNear: 12, fogFar: 40, particles: 'motes' },
  'chapter-08': { background: '#242039', fog: '#3b304c', key: '#ffe7a4', rim: '#ffb7c8', particle: '#ffb7c8', grade: [1.08, 0.98, 1.02], bloom: 0.58, fogNear: 18, fogFar: 58, particles: 'petals' },
});

const gradeShader = {
  uniforms: { tDiffuse: { value: null }, uGrade: { value: new THREE.Vector3(1, 1, 1) }, uVignette: { value: 0.28 }, uGrain: { value: 0.012 }, uTime: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: 'uniform sampler2D tDiffuse; uniform vec3 uGrade; uniform float uVignette; uniform float uGrain; uniform float uTime; varying vec2 vUv; void main(){ vec4 c=texture2D(tDiffuse,vUv); c.rgb*=uGrade; float d=distance(vUv,vec2(0.5)); c.rgb*=1.0-uVignette*smoothstep(0.22,0.76,d); float n=fract(sin(dot(vUv*vec2(1300.0,730.0)+uTime,vec2(12.9898,78.233)))*43758.5453)-0.5; c.rgb+=n*uGrain; gl_FragColor=c; }',
};

export function createVisualPipeline(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.55, 0.82);
  composer.addPass(bloom);
  const grade = new ShaderPass(gradeShader);
  composer.addPass(grade);
  const bokeh = new BokehPass(scene, camera, { focus: 12, aperture: 0.00008, maxblur: 0.004 });
  bokeh.enabled = false;
  composer.addPass(bokeh);
  let preset = 'high';
  let elapsed = 0;
  return {
    render(deltaSeconds = 0, look = CHAPTER_LOOKS['chapter-01'], quality = 'high', cutscene = false) {
      elapsed += deltaSeconds;
      preset = quality;
      const low = preset === 'low';
      const medium = preset === 'medium';
      bloom.enabled = !low;
      bloom.strength = low ? 0 : medium ? Math.min(0.28, look.bloom) : look.bloom;
      bloom.radius = medium ? 0.25 : 0.55;
      grade.enabled = true;
      grade.uniforms.uGrade.value.set(...look.grade);
      grade.uniforms.uVignette.value = low ? 0.18 : 0.28;
      grade.uniforms.uGrain.value = low || medium ? 0 : 0.008;
      grade.uniforms.uTime.value = elapsed;
      bokeh.enabled = !low && cutscene;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, low ? 0.75 : medium ? 1 : 1.5));
      composer.setSize(renderer.domElement.clientWidth || 1, renderer.domElement.clientHeight || 1);
      composer.render();
    },
    setPreset(value) { if (['low', 'medium', 'high'].includes(value)) preset = value; },
    getPreset() { return preset; },
    dispose() { composer.passes.forEach((pass) => { pass.dispose?.(); }); composer.renderTarget1.dispose(); composer.renderTarget2.dispose(); },
  };
}
