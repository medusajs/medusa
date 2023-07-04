const path = require("path")

module.exports = {
  plugins: [
    require("tailwindcss/nesting"),
    require("tailwindcss")({
      config: path.join(__dirname, "tailwind.config.js"),
    }),
    require("autoprefixer"),
  ],
}
