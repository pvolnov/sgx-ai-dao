import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgLoader from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 1234,
  },

  build: {
    target: "es2020",
  },

  esbuild: {
    target: "es2020",
  },

  plugins: [
    //
    svgLoader(),
    nodePolyfills(),
    react(),
  ],

  optimizeDeps: {
    exclude: ["@xmtp/user-preferences-bindings-wasm"],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@uikit": path.resolve(__dirname, "./src/uikit"),
    },
  },
});
