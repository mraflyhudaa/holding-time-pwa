import process from "node:process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import replace from "@rollup/plugin-replace";

const pwaOptions = {
  mode: "development",
  base: "/",
  includeAssets: ["favicon.svg"],
  manifest: {
    name: "Holding Time",
    short_name: "Holding Time",
    theme_color: "#ffffff",
    id: "/",
    display: "fullscreen",
    icons: [
      {
        src: "pwa-192x192.png", // <== don't add slash, for testing
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-512x512.png", // <== don't remove slash, for testing
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png", // <== don't add slash, for testing
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === "true",
    /* when using generateSW the PWA plugin will switch to classic */
    type: "module",
    navigateFallback: "index.html",
  },
};

const replaceOptions = { __DATE__: new Date().toISOString() };
const claims = process.env.CLAIMS === "true";
const reload = process.env.RELOAD_SW === "true";
const selfDestroying = process.env.SW_DESTROY === "true";

if (process.env.SW === "true") {
  pwaOptions.srcDir = "src";
  pwaOptions.filename = claims ? "claims-sw.js" : "prompt-sw.js";
  pwaOptions.strategies = "injectManifest";
  pwaOptions.manifest.name = "PWA Holding Time Manifest";
  pwaOptions.manifest.short_name = "PWA Holding Time";
  pwaOptions.injectManifest = {
    minify: false,
    enableWorkboxModulesLogs: true,
  };
}

if (claims) pwaOptions.registerType = "autoUpdate";

if (reload) {
  replaceOptions.__RELOAD_SW__ = JSON.stringify(true); // Add JSON.stringify to handle boolean
  console.log(replaceOptions);
}

if (selfDestroying) pwaOptions.selfDestroying = selfDestroying;

export default defineConfig({
  // base: process.env.BASE_URL || 'https://github.com/',
  build: {
    sourcemap: process.env.SOURCE_MAP === "true",
  },
  plugins: [
    react(),
    VitePWA(pwaOptions),
    replace({
      values: replaceOptions, // Use the `values` property to pass replaceOptions
      preventAssignment: true, // Add this option to prevent assignment error
    }),
  ],
});
