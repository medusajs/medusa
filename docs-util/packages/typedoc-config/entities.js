/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/medusa/src/models/index.ts",
  tsConfigName: "medusa.json",
  name: "entities",
})
