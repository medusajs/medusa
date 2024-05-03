/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/store/src/models/index.ts",
  name: "store-models",
  tsConfigName: "store.json",
})
