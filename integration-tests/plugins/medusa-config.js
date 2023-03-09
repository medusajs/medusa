const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME

module.exports = {
  plugins: [
    {
      resolve: `medusa-fulfillment-webshipper`,
      options: {
        account: "test-account",
        api_token: "something",
        order_channel_id: "1",
        webhook_secret: "1234",
      },
    },
    {
      resolve: `medusa-plugin-sendgrid`,
      options: {
        api_key: "SG.TEST",
      },
    },
  ],
  projectConfig: {
    // redis_url: REDIS_URL,
    database_url: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
    database_type: "postgres",
    jwt_secret: "test",
    cookie_secret: "test",
  },
  modules: {
    stockLocationService: {
      scope: "internal",
      resources: "shared",
      resolve: "@medusajs/stock-location",
    },
    inventoryService: {
      scope: "internal",
      resources: "shared",
      resolve: "@medusajs/inventory",
    },
    cacheService: {
      resolve: "@medusajs/cache-inmemory",
      options: { ttl: 5 },
    },
  },
}
