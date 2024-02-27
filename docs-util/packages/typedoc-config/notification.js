/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = getConfig({
  entryPointPath: "packages/medusa/src/interfaces/notification-service.ts",
  tsConfigName: "medusa.json",
  name: "notification",
  parentIgnore: true,
})
