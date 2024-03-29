import path from "path"

const rootProject = path.join(
  process.cwd(),
  "../../apps/server/src/admin/**/*.{js,jsx,ts,tsx}"
)

// get the path of the dependency "@medusajs/ui"
const medusaUI = path.join(
  path.dirname(require.resolve("@medusajs/ui")),
  "**/*.{js,jsx,ts,tsx}"
)

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    medusaUI,
    rootProject,
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
}
