/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/pricing/src/models/index.ts",
  name: "pricing-models",
  tsConfigName: "pricing.json",
})
