const { Modules } = require("@medusajs/modules-sdk")
const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
process.env.POSTGRES_URL = DB_URL

const enableMedusaV2 = process.env.MEDUSA_FF_MEDUSA_V2 == "true"

module.exports = {
  plugins: [],
  projectConfig: {
    database_url: DB_URL,
    database_type: "postgres",
    jwt_secret: "test",
    cookie_secret: "test",
  },
  featureFlags: {
    medusa_v2: enableMedusaV2,
  },
  modules: {
    [Modules.AUTH]: {
      scope: "internal",
      resources: "shared",
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            name: "emailpass",
            scopes: {
              admin: {},
              store: {},
            },
          },
        ],
      },
    },
    [Modules.USER]: {
      scope: "internal",
      resources: "shared",
      resolve: "@medusajs/user",
      options: {
        jwt_secret: "test",
      },
    },
    [Modules.CACHE]: {
      resolve: "@medusajs/cache-inmemory",
      options: { ttl: 0 }, // Cache disabled
    },
    [Modules.STOCK_LOCATION]: true,
    [Modules.INVENTORY]: true,
    [Modules.PRODUCT]: true,
    [Modules.PRICING]: true,
    [Modules.PROMOTION]: true,
    [Modules.CUSTOMER]: true,
    [Modules.SALES_CHANNEL]: true,
    [Modules.CART]: true,
    [Modules.WORKFLOW_ENGINE]: true,
    [Modules.REGION]: true,
    [Modules.API_KEY]: true,
    [Modules.STORE]: true,
    [Modules.TAX]: true,
  },
}
