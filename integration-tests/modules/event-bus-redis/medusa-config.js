const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME

module.exports = {
  projectConfig: {
    database_url: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
    database_type: "postgres",
    jwt_secret: "test",
    cookie_secret: "test",
  },
  modules: {
    eventBus: {
      resolve: "@medusajs/event-bus-redis",
      scope: "internal",
      resources: "shared",
      redisUrl: process.env.REDIS_URL,
    },
  },
}
