const { defineConfig, Modules } = require("@medusajs/framework/utils")
const { schema } = require("./schema")

export const dbName = "medusa-index-integration-2024"
const DB_HOST = process.env.DB_HOST ?? "localhost:5432"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? ""
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${dbName}`

const config = defineConfig({
  admin: {
    disable: true,
  },
  projectConfig: {
    databaseUrl: DB_URL,
  },
})

Object.keys(config.modules).forEach((key) => {
  if ([Modules.EVENT_BUS].includes(key)) {
    return
  }

  config.modules[key] = false
})

config.modules[Modules.INDEX] = {
  resolve: "@medusajs/index",
  dependencies: [Modules.EVENT_BUS],
  options: {
    schema,
  },
}

config.modules[Modules.PRODUCT] = true
config.modules[Modules.PRICING] = true

export default config
