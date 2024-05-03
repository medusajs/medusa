/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/product/src/models/index.ts",
  name: "product-models",
  tsConfigName: "product.json",
})
