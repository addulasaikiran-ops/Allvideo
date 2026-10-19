#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.argv[2] ?? 'public/models';
const files = [];
function walk(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (extname(path).toLowerCase() === '.gltf' || extname(path).toLowerCase() === '.glb') files.push(path);
  }
}
walk(root);
if (!files.length) {
  console.log(`No glTF models found under ${root}. Usage: node scripts/optimize-models.mjs [model-directory]`);
  process.exit(0);
}
for (const input of files) {
  const output = input.replace(/\.(gltf|glb)$/i, '.optimized.$1');
  const result = spawnSync('npx', ['--yes', '@gltf-transform/cli', 'optimize', input, output, '--compress', 'meshopt'], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log(`Optimized ${relative(root, input)} → ${relative(root, output)}`);
}
