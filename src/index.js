// path: src/index.js
// Clean entry (no merge markers, no BOM). If you don't have App.enhanced.js, change to './App'.

import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.enhanced';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
