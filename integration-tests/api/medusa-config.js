const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"
const cacheTTL = process.env.CACHE_TTL ?? 15
const enableResponseCompression =
  process.env.ENABLE_RESPONSE_COMPRESSION || true

module.exports = {
  plugins: [],
  projectConfig: {
    redis_url: redisUrl,
    database_url: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
    database_type: "postgres",
    jwt_secret: "test",
    cookie_secret: "test",
    http_compression: {
      enabled: enableResponseCompression,
    },
  },
  modules: {
    cacheService: {
      resolve: "@medusajs/cache-inmemory",
      options: { ttl: cacheTTL },
    },
  },
}
