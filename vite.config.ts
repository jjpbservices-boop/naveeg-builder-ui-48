// vite.config.ts
import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"; // ✅ correct import
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(), // Corrected spelling, // Make sure this uses the correct imported name
    eslint({ exclude: ["src/routeTree.gen.ts"] }),
    splitVendorChunkPlugin(),
  ],
  resolve: { alias: { "@": "/src" } },
  build: {
    rollupOptions: {
      output: {
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
  server: { watch: { ignored: ["**/src/routeTree.gen.ts"] } },
});