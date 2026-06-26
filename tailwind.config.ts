import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          50: "#f0f3f9",
          100: "#d9e2f0",
          200: "#b3c5e1",
          300: "#7d9dca",
          400: "#4a72ae",
          500: "#2a5298",
          600: "#1e3d7a",
          700: "#162d5e",
          800: "#0f1f42",
          900: "#0a1428",
          950: "#06091a",
        },
        gold: {
          50: "#fdfbf0",
          100: "#faf4d3",
          200: "#f5e89e",
          300: "#edd45e",
          400: "#e4bc2a",
          500: "#c9a218",
          600: "#a07e12",
          700: "#7a5f0f",
          800: "#5c4710",
          900: "#4a3a10",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
