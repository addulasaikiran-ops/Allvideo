import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './ui/ErrorBoundary.jsx';
import { ToastProvider } from './ui/design-system.jsx';
import { PWAControls } from './ui/PWAControls.jsx';
import './styles/global.css';

const PRELOAD_RELOAD_KEY = 'allvideo:vite-preload-reload';
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    // Retry a stale hashed chunk once after a deploy; let a second failure surface.
    if (sessionStorage.getItem(PRELOAD_RELOAD_KEY) === '1') return;
    event.preventDefault();
    sessionStorage.setItem(PRELOAD_RELOAD_KEY, '1');
    window.location.reload();
  });
}

const GameShell = lazy(() => import('./ui/GameShell.jsx').then((module) => {
  sessionStorage.removeItem(PRELOAD_RELOAD_KEY);
  return { default: module.GameShell };
}));

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <Suspense fallback={<main role="status" style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', color: 'var(--color-text)', background: 'var(--color-background)' }}>Gathering the little things…</main>}>
          <GameShell />
        </Suspense>
        <PWAControls />
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
