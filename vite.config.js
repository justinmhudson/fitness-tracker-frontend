import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// When you deploy to GitHub Pages, set "base" to '/your-repo-name/'
// (matching your GitHub repo's name exactly, with slashes on both sides).
// Locally in dev mode this doesn't matter, so it's safe to update anytime.
export default defineConfig({
  plugins: [react()],
  base: '/fitness-tracker-frontend/',
});
