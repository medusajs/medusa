/* eslint-disable @typescript-eslint/no-var-requires */
const modelConfig = require("./_models")

module.exports = modelConfig({
  entryPointPath: "packages/customer/src/models/index.ts",
  name: "customer-models",
  tsConfigName: "customer.json",
})
