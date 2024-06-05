const { defineConfig, Modules } = require("@medusajs/utils")
const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
process.env.DATABASE_URL = DB_URL
process.env.LOG_LEVEL = "error"

const customFulfillmentProvider = {
  resolve: "@medusajs/fulfillment-manual",
  options: {
    config: {
      "test-provider": {},
    },
  },
}

module.exports = defineConfig({
  admin: {
    disable: true,
  },
  projectConfig: {
    http: {
      jwtSecret: "test",
    },
  },
  modules: {
    [Modules.FULFILLMENT]: {
      /** @type {import('@medusajs/fulfillment').FulfillmentModuleOptions} */
      options: {
        providers: [customFulfillmentProvider],
      },
    },
  },
})
