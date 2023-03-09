const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

module.exports = {
  plugins: [],
  projectConfig: {
    redis_url: redisUrl,
    database_url: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
    database_type: "postgres",
    jwt_secret: "test",
    cookie_secret: "test",
  },
  modules: {
    cacheService: {
      resolve: "@medusajs/cache-inmemory",
      // don't set cache since this is shared between tests
      // and since we have "test-product" / "test-variant" as ids
      // in a bunch of tests, this could cause that incorrect data is returned
      // (e.g. price selection caches calculations under `ps:${variantId}`)
      options: { ttl: 0 },
    },
  },
}
