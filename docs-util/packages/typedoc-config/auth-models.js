/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/auth/src/models/index.ts",
  name: "auth-models",
  tsConfigName: "auth.json",
})
