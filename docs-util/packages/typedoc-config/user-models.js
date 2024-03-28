/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/user/src/models/index.ts",
  name: "user-models",
  tsConfigName: "user.json",
})
