import { access, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const manifests = ['src/audio/manifest.js', 'src/engine/asset-manifest.js'];
const references = new Set();

for (const manifestPath of manifests) {
  const source = await readFile(resolve(root, manifestPath), 'utf8');
  for (const match of source.matchAll(/\/(?:audio|assets|story)\/[A-Za-z0-9._/-]+/g)) {
    references.add(match[0]);
  }
}

const problems = [];
for (const url of references) {
  const filePath = resolve(root, 'public', url.slice(1));
  try {
    await access(filePath);
    const details = await stat(filePath);
    if (!details.isFile()) problems.push(`${url} (not a file)`);
    else if (details.size === 0) problems.push(`${url} (0 bytes)`);
  } catch {
    problems.push(`${url} (missing)`);
  }
}

if (problems.length) {
  console.error('Asset verification failed. Every manifest asset must exist and be non-empty:');
  for (const problem of problems) console.error(` - ${problem}`);
  process.exitCode = 1;
} else {
  console.log(`Verified ${references.size} manifest asset paths; all exist and are non-empty.`);
}
