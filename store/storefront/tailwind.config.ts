import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — gold & warm white
        gold: {
          50:  "#fdfbf3",
          100: "#faf4e1",
          200: "#f4e4b4",
          300: "#ecce7d",
          400: "#e2b545",
          500: "#c9962a",  // primary brand gold
          600: "#a97920",
          700: "#865e18",
          800: "#664814",
          900: "#4d360f",
        },
        cream: {
          50:  "#fffef9",
          100: "#fefdf0",
          200: "#fdf9db",
          300: "#fbf3be",
          400: "#f7e996",
        },
        charcoal: {
          800: "#1c1917",
          900: "#0c0a09",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans:  ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern": "linear-gradient(135deg, #fdfbf3 0%, #faf4e1 100%)",
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease-out",
        "fade-in":    "fadeIn 0.3s ease-out",
        "slide-left": "slideLeft 0.5s ease-out",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideLeft: {
          "0%":   { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        "gold-sm": "0 1px 4px 0 rgba(201, 150, 42, 0.15)",
        "gold-md": "0 4px 16px 0 rgba(201, 150, 42, 0.2)",
        "gold-lg": "0 8px 32px 0 rgba(201, 150, 42, 0.25)",
      },
    },
  },
  plugins: [],
}

export default config
