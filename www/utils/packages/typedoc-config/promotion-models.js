/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/promotion/src/models/index.ts",
  name: "promotion-models",
  tsConfigName: "promotion.json",
})
