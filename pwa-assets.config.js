import { defineConfig } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    transparent: {
      sizes: [64, 192, 512, 1024],
      favicons: [
        [48, "favicon-48x48.ico"],
        [64, "favicon.ico"],
      ],
    },
    maskable: {
      sizes: [512, 1024],
    },
    apple: {
      sizes: [180],
    },
  },
  images: ["public/logo.svg"],
});
