/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/types/src/common/config-module.ts",
  tsConfigName: "types.json",
  name: "medusa-config",
})
