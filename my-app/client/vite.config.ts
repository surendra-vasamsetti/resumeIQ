import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // ✅ Add this line for deployment
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
