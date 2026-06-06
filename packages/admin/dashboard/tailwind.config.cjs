const path = require("path")

// get the path of the dependency "@zjedene-medusa/ui"
const medusaUI = path.join(
  path.dirname(require.resolve("@zjedene-medusa/ui")),
  "**/*.{js,jsx,ts,tsx}"
)

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@zjedene-medusa/ui-preset")],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", medusaUI],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
}
