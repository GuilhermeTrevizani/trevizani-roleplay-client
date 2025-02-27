import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'C:\\RAGEMP\\server-files\\client_packages\\webviews',
    emptyOutDir: true,
    minify: 'esbuild',
    reportCompressedSize: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
});
