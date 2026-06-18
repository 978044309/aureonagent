import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        line: "#e7e5df",
        paper: "#f8f7f3",
        field: "#ffffff",
        signal: "#0f766e",
        amberline: "#c47b2a"
      },
      boxShadow: {
        panel: "0 20px 70px rgba(17, 17, 17, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
