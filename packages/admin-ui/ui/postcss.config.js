const path = require("path")
const tailwindnesting = require("tailwindcss/nesting")

module.exports = {
  plugins: {
    tailwindnesting,
    tailwindcss: { config: path.join(__dirname, "tailwind.config.js") },
    autoprefixer: {},
  },
}
