/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/utils/src/payment/abstract-payment-provider.ts",
  tsConfigName: "utils.json",
  name: "payment-provider",
})
