import { defineConfig } from "vite";
import inlineScript from "./plugin/inline";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), inlineScript()],
  build: { cssCodeSplit: true, ssrManifest: true },
});
