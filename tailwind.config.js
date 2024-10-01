/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        hokben: {
          primary: "#E60012", // Hokben red
          secondary: "#FFC72C", // Warm yellow
          accent: "#2C5F2D", // Forest green
          neutral: "#1F2937", // Dark gray
          "base-100": "#FFFFFF", // White
          info: "#93C5FD", // Light blue
          success: "#34D399", // Green
          warning: "#FBBF24", // Yellow
          error: "#DC2626", // Red

          // Custom color
          "hokben-brown": "#8B4513", // Brown for wood textures

          // Modify state colors
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.3rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-text-case": "uppercase",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.3rem",
        },
      },
    ],
  },
  theme: {
    extend: {},
  },
};
