import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        master: "#FEE101",
        gold: "#D6AF36",
        silver: "#D7D7D7",
        bronze: "#A77044",
      },
      fontFamily:{
        sans:['var(--font-electrolize)']
      }
    },
  },
  plugins: [],
};
export default config;
