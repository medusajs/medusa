/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/types/src/index.ts",
  tsConfigName: "types.json",
  name: "types",
  jsonFileName: "0-types",
  enableInternalResolve: true,
  exclude: [
    "**/pricing/**.ts",
    "**/product/**.ts",
    "**/inventory/**.ts",
    "**/stock-location/**.ts",
  ],
})
