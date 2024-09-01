import process from "node:process";
import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import replace from "@rollup/plugin-replace";
import compression from "vite-plugin-compression2";

const pwaOptions = {
  mode: "production",
  base: "/",
  includeAssets: ["favicon.svg"],
  manifest: {
    name: "Holding Time",
    short_name: "Holding Time",
    description: "Holding Time PWA",
    robots: "index, follow",
    theme_color: "#ffffff",
    id: "/",
    "display-override": ["fullscreen", "standalone"],
    display: "standalone",
    start_url: "/",
    orientation: "landscape",
    viewport: "width=device-width, initial-scale=1, user-scalable=no",
    background_color: "#ffffff",
    lang: "en",
    icons: [
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "favicon.ico",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === "true",
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
  replaceOptions.__RELOAD_SW__ = JSON.stringify(true);
  console.log(replaceOptions);
}

if (selfDestroying) pwaOptions.selfDestroying = selfDestroying;

export default defineConfig({
  // base: process.env.BASE_URL || 'https://github.com/',
  build: {
    sourcemap: process.env.SOURCE_MAP === "true",
    minify: true,
  },
  plugins: [
    react(),
    VitePWA(pwaOptions),
    replace({
      values: replaceOptions,
      preventAssignment: true,
    }),
    compression({ exclude: /config\.json$/ }),
  ],
});
