/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/medusa/src/index.js",
  tsConfigName: "medusa.json",
  name: "medusa",
  enableInternalResolve: true,
  exclude: [
    "**/models/**.ts",
    "**/services/**.ts",
    "**/interfaces/fulfillment-service.ts",
  ],
})
