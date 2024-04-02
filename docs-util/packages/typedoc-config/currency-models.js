/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/currency/src/models/index.ts",
  name: "currency-models",
  tsConfigName: "currency.json",
})
