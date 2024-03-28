/* eslint-disable @typescript-eslint/no-var-requires */
const modulesConfig = require("./_modules")

module.exports = modulesConfig({
  entryPointPath: "packages/types/src/inventory/service-next.ts",
  name: "inventory-next",
})
