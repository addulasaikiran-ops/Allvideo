import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './ui/ErrorBoundary.jsx';
import { ToastProvider } from './ui/design-system.jsx';
import './styles/global.css';

const GameShell = lazy(() => import('./ui/GameShell.jsx').then((module) => ({ default: module.GameShell })));

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <Suspense fallback={<main role="status" style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', color: 'var(--color-text)', background: 'var(--color-background)' }}>Gathering the little things…</main>}>
          <GameShell />
        </Suspense>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
