const { defineConfig, Modules } = require("@zjedene-medusa/utils")
const os = require("os")
const path = require("path")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
process.env.DATABASE_URL = DB_URL
process.env.LOG_LEVEL = "error"

module.exports = defineConfig({
  admin: {
    disable: true,
  },
  projectConfig: {
    http: {
      jwtSecret: "test",
    },
    workerMode: "server",
    redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  },
  modules: {
    [Modules.EVENT_BUS]: {
      resolve: "@zjedene-medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
      },
    },
    [Modules.FILE]: {
      resolve: "@zjedene-medusa/file",
      options: {
        providers: [
          {
            resolve: "@zjedene-medusa/file-local",
            id: "local",
            options: {
              upload_dir: path.join(os.tmpdir(), "uploads"),
              private_upload_dir: path.join(os.tmpdir(), "static"),
            },
          },
        ],
      },
    },
  },
})
