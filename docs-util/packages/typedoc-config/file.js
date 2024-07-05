/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/medusa/src/interfaces/file-service.ts",
  tsConfigName: "medusa.json",
  name: "file",
  parentIgnore: true,
})
