import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// last 10 versions + latest
const versions = [
  'jsonata-2.1.0',
  'jsonata-2.0.6',
  'jsonata-2.0.5',
  'jsonata-2.0.4',
  'jsonata-2.0.3',
  'jsonata-2.0.2',
  'jsonata-2.0.1',
  'jsonata-2.0.0',
  'jsonata-1.8.7',
  'jsonata-1.8.6',
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: versions.reduce((acc, v) => ({ ...acc, [v]: v }), {})
  },
  optimizeDeps: {
    include: ['jsonata', ...versions]
  }
})
