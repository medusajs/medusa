const CircularPatch = require("./decorators/circular-patch.cjs")

const id = "medusa"

const decorators = {
  oas3: {
    "circular-patch": CircularPatch,
  },
}

module.exports = function medusaPlugin() {
  return {
    id,
    decorators,
  }
}
