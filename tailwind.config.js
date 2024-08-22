/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: ["emerald"],
    base: true,
    styled: true,
    utils: true,
    themeRoot: ":root",
  },
  plugins: [require("daisyui")],
};
