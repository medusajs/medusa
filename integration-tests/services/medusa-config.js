const { Modules } = require("@medusajs/modules-sdk")
const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

module.exports = {
  plugins: [],
  projectConfig: {
    // redis_url: REDIS_URL,
    database_url: DB_URL,
    database_type: "postgres",
    jwt_secret: "test",
    cookie_secret: "test",
    database_extra: { idle_in_transaction_session_timeout: 0 },
  },
  featureFlags: {},
  modules: {
    [Modules.CACHE]: {
      resolve: "@medusajs/cache-inmemory",
      options: { ttl: 0 }, // Cache disabled
    },
  },
}
