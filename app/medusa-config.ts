import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  // When REDIS_URL is set, use Redis-backed event bus and workflow engine so
  // the app runs reliably across restarts and (optionally) multiple instances.
  modules: process.env.REDIS_URL
    ? [
        {
          resolve: "@medusajs/medusa/event-bus-redis",
          options: { redisUrl: process.env.REDIS_URL },
        },
        {
          resolve: "@medusajs/medusa/workflow-engine-redis",
          options: { redis: { url: process.env.REDIS_URL } },
        },
      ]
    : [],
})
