import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

import { Analytics } from '@vercel/analytics/react'

console.log('Main: Starting initialization...');

window.addEventListener('error', (event) => {
  console.error('Fatal crash detected:', event.error);
  // Show error on screen for user to report
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 20px; color: #f87171; background: #1e293b; height: 100vh; font-family: sans-serif;">
      <h1 style="font-size: 20px;">Application Crash</h1>
      <pre style="font-size: 13px; background: #0f172a; padding: 15px; border-radius: 8px; overflow: auto; border: 1px solid #334155;">${event.error?.stack || event.message}</pre>
    </div>`;
  }
});

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element not found');

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
      <Analytics />
    </React.StrictMode>,
  );
  console.log('Main: Rendered root successfully');
} catch (error) {
  console.error('Main: Mounting failed:', error);
}
