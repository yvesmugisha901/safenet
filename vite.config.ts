import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react() // just the default plugin, remove esbuild option
    ],
    optimizeDeps: {
        // if you had rollupOptions, rename to rolldownOptions
        // example:
        rolldownOptions: {}
    },
    ssr: {
        optimizeDeps: {
            rolldownOptions: {}
        }
    }
});