import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/users': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/products': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/owners': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/shop': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/cart': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/product': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/buynow': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/addtocart': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/clearcart': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/logout': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
});
