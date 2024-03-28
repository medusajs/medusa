/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/sales-channel/src/models/index.ts",
  name: "sales-channel-models",
  tsConfigName: "sales-channel.json",
})
