import coreConfig from "../tailwind.config"

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...coreConfig,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
}
