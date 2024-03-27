/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/cart/src/models/index.ts",
  name: "cart-models",
  tsConfigName: "cart.json",
})
