import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows access from external devices
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
