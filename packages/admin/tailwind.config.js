const path = require("path")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.resolve(__dirname, "./dashboard/**/*.{js,jsx,ts,tsx}"),
    path.resolve(__dirname, "./dashboard/index.html"),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
