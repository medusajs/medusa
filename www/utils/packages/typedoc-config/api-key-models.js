/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/api-key/src/models/index.ts",
  name: "api-key-models",
  tsConfigName: "api-key.json",
})
