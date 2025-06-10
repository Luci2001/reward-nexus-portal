
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { HmrContext } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      // Enable watching of JSON files in public directory
      include: ['src/**/*', 'public/**/*.json'],
      ignored: ['**/node_modules/**', '**/dist/**']
    }
  },
  preview: {
    port: 8080,
    host: "::"
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Custom plugin for JSON hot reloading
    {
      name: 'json-hmr',
      handleHotUpdate({ file, server }: HmrContext) {
        if (file.includes('public/data/') && file.endsWith('.json')) {
          console.log(`[JSON HMR] ${file} changed, triggering reload`);
          server.ws.send({
            type: 'full-reload'
          });
          return [];
        }
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
