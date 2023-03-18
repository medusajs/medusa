const original = require("./original-medusa-config")

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  ...original,
  projectConfig: {
    ...original.projectConfig,
    redis_url: process.env.REDIS_URL ?? original.projectConfig.redis_url,
    database_url:
      process.env.DATABASE_URL ?? original.projectConfig.database_url,
    database_type: "postgres",
    store_cors: process.env.STORE_CORS ?? original.projectConfig.store_cors,
    admin_cors: process.env.ADMIN_CORS ?? original.projectConfig.admin_cors,
  },
}
