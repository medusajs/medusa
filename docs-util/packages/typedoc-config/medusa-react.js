/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/medusa-react/src/index.ts",
  tsConfigName: "medusa-react.json",
  name: "medusa-react",
  generateNamespaces: true,
  ignoreApi: true,
})
