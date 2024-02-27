/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/utils/src/search/abstract-service.ts",
  tsConfigName: "utils.json",
  name: "search",
})
