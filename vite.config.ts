import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Debug: Log environment variables
    console.log('Environment variables loaded:', {
        mode,
        GEMINI_API_KEY: env.VITE_GEMINI_API_KEY ? 'SET' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV
    });
    
    return {
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ''),
        'process.env.NODE_ENV': JSON.stringify(mode),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              charts: ['recharts']
            }
          }
        }
      },
      optimizeDeps: {
        include: ['firebase/app', 'firebase/auth', 'firebase/firestore']
      }
    };
});
