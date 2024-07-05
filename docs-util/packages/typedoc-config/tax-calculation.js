/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/medusa/src/interfaces/tax-calculation-strategy.ts",
  tsConfigName: "medusa.json",
  name: "tax-calculation",
  parentIgnore: true,
})
