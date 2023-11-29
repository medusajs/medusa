/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/medusa/src/index.js",
  tsConfigName: "medusa.json",
  name: "medusa",
  // entryPointStrategy: "expand",
  enableInternalResolve: true,
})
