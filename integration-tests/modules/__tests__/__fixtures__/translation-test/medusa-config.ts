const { defineConfig } = require("@zjedene-medusa/framework/utils")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

process.env.DATABASE_URL = DB_URL

module.exports = defineConfig({
  admin: {
    disable: true,
  },
  projectConfig: {
    http: {
      jwtSecret: "secret",
    },
  },
  modules: [
    {
      key: "translation",
      resolve: "./src/modules/translation",
    },
  ],
})
