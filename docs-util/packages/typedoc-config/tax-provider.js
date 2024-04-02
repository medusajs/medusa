/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/types/src/tax/provider.ts",
  tsConfigName: "types.json",
  name: "tax-provider",
})
