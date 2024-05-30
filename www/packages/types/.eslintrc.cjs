const path = require("path")

module.exports = {
  extends: ["docs"],
  parserOptions: {
    project: true,
    tsconfigRootDir: path.join(__dirname, "..", ".."),
  },
}
