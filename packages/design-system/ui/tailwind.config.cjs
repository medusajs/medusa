/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@zjedene-medusa/ui-preset")],
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: ["class", '[data-mode="dark"]'],
}
