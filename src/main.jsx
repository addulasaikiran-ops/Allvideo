import React from 'react';
import { createRoot } from 'react-dom/client';
import { GameShell } from './ui/GameShell.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameShell />
  </React.StrictMode>,
);
