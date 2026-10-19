import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

function versionServiceWorker() {
  let buildHash = 'dev';
  return {
    name: 'allvideo-version-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const names = Object.keys(bundle).sort().join('\n');
      buildHash = createHash('sha256').update(names).digest('hex').slice(0, 12);
    },
    closeBundle() {
      const workerPath = resolve(process.cwd(), 'dist/sw.js');
      const worker = readFileSync(workerPath, 'utf8');
      if (!worker.includes('__BUILD_HASH__')) throw new Error('Service worker build hash placeholder is missing');
      writeFileSync(workerPath, worker.replaceAll('__BUILD_HASH__', buildHash));
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), versionServiceWorker()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});
