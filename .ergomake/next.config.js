const original = require("./original-next.config")

module.exports = {
  ...original,
  output: "standalone",
}
