import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        saffron: "#d97706",
        cream: "#fffaf2",
        maroon: "#7c2d12"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(23,23,23,.08)"
      }
    }
  },
  plugins: []
};
export default config;