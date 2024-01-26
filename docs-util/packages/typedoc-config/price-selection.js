/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/medusa/src/interfaces/price-selection-strategy.ts",
  tsConfigName: "medusa.json",
  name: "price-selection",
  parentIgnore: true,
})
