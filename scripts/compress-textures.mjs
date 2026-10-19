#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.argv[2] ?? 'public/assets';
const files = [];
function walk(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
}
walk(root);
const images = files.filter((path) => ['.png', '.jpg', '.jpeg'].includes(extname(path).toLowerCase()));
if (!images.length) {
  console.log(`No PNG/JPEG textures found under ${root}. Usage: node scripts/compress-textures.mjs [asset-directory]`);
  process.exit(0);
}
for (const input of images) {
  const output = input.replace(/\.(png|jpe?g)$/i, '.webp');
  const result = spawnSync('npx', ['--yes', 'sharp-cli', '-i', input, '-o', output, 'webp', '--quality', '82'], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log(`Compressed ${relative(root, input)} → ${relative(root, output)}`);
}
