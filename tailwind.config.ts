import type { Config } from "tailwindcss";

// Brand palette
// Navy:  #0F1F3D (primary dark)
// Gold:  #C9A84C (accent)
// Cream: #F8F7F4 (warm off-white background)
// White: #FFFFFF

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
          50:  "#eef1f7",
          100: "#d5dcea",
          200: "#abbad5",
          300: "#7d97bf",
          400: "#5374a9",
          500: "#355693",
          600: "#264278",
          700: "#1a2f5c",
          800: "#0F1F3D", // brand primary
          900: "#0a1428",
          950: "#060c1a",
        },
        gold: {
          50:  "#fbf8ee",
          100: "#f5edce",
          200: "#ead89d",
          300: "#dfc06b",
          400: "#C9A84C", // brand accent
          500: "#b08d35",
          600: "#8d6f27",
          700: "#6a521c",
          800: "#473813",
          900: "#2a210b",
        },
        cream: "#F8F7F4", // warm off-white background
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
