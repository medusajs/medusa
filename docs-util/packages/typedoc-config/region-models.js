/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/region/src/models/index.ts",
  name: "region-models",
  tsConfigName: "region.json",
})
