/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/tax/src/models/index.ts",
  name: "tax-models",
  tsConfigName: "tax.json",
})
