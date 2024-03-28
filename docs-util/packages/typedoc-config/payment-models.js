/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/payment/src/models/index.ts",
  name: "payment-models",
  tsConfigName: "payment.json",
})
