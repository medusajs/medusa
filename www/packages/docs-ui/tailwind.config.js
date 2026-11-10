import coreConfig from "docs-tailwind/modified.tailwind.config"

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...coreConfig,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
}
