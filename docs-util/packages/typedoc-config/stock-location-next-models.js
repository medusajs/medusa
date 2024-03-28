/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/stock-location-next/src/models/index.ts",
  name: "stock-location-next-models",
  tsConfigName: "stock-location-next.json",
})
