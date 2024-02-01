/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/workflows-sdk/src/utils/composer/index.ts",
  // entryPointStrategy: "expand",
  tsConfigName: "workflows.json",
  name: "workflows",
  // enableInternalResolve: true,
})
