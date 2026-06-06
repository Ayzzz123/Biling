import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef2f2",
          100: "#ffe1e1",
          200: "#ffc8c8",
          300: "#ffa3a3",
          400: "#ff6b6b",
          500: "#ff3b3b",
          600: "#ed1c1c",
          700: "#c81010",
          800: "#a51111",
          900: "#881515",
        },
      },
    },
  },
  plugins: [],
}

export default config
