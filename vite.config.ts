import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import eslint from "@nabla/vite-plugin-eslint";
//import tsconfigPath from "vite-tsconfig-paths"
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  build: {
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    outDir: "./dist",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react"],
          "react-dom": ["react-dom"],
          "react-router-dom": ["react-router-dom"],
          "react-router": ["react-router"],
        },
      },
    },
  },
  server: {
    port: 4202,
    open: true,
  },
  plugins: [react(), svgr(), eslint(), /*tsconfigPath(),*/],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
      //"@": path.resolve(__dirname, "./src"),
      //"@lib": path.resolve(__dirname, "./src/lib"),
    },
  },
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
});
