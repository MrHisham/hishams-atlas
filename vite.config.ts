import {defineConfig} from 'vite';
export default defineConfig({
  server: { watch: { ignored: ['**/docs/**', '**/test-results/**'] } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          react: ['react', 'react-dom'],
          storage: ['dexie', 'zod'],
          pdf: ['pdfjs-dist'],
        },
      },
    },
  },
});
