/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/inventory/src/models/index.ts",
  name: "inventory-models",
  tsConfigName: "inventory.json",
})
