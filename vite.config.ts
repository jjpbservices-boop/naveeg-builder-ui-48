// vite.config.ts
import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

export default defineConfig({
  plugins: [react(), TanStackRouterVite(), splitVendorChunkPlugin()],
  resolve: { alias: { "@": "/src" } }, // no @rollup/plugin-alias needed
  build: {
    rollupOptions: {
      output: {
        // function form avoids the splitVendorChunk warning
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react")) return "react";
          if (id.includes("@tanstack")) return "tanstack";
          if (id.includes("recharts")) return "recharts";
          if (id.includes("i18next")) return "i18n";
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
});