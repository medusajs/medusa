/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/workflows-sdk/src/utils/composer/index.ts",
  tsConfigName: "workflows.json",
  name: "workflows",
})
