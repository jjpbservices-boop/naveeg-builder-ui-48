// vite.config.ts
import { defineConfig, splitVendorChunkPlugin, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"; // ✅ correct import
// The eslint plugin is optional: when running in an environment where
// `vite-plugin-eslint` isn't installed (for example in a fresh CI
// environment without dev dependencies), Vite used to throw a module
// resolution error and the dev server failed to start.  We attempt to
// load the plugin dynamically and simply skip it if it's not available.
// This allows the application to run even when the plugin is missing.

let eslintPlugin: PluginOption[] = [];
try {
  const { default: eslint } = await import("vite-plugin-eslint");
  eslintPlugin = [eslint({ exclude: ["src/routeTree.gen.ts"] })];
} catch {
  // eslint plugin is not installed; continue without linting
}

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    TanStackRouterVite(), // Corrected spelling, // Make sure this uses the correct imported name
    ...eslintPlugin,
    splitVendorChunkPlugin(),
  ],
  resolve: { alias: { "@": "/src" } },
  build: {
    outDir: "dist",
    sourcemap: true,
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
