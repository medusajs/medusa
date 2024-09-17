const { defineConfig, Modules } = require("@medusajs/utils")
const { schema } = require("./schema")

export const dbName = "medusa-index-integration-2024"

const config = defineConfig({
  admin: {
    disable: true,
  },
  projectConfig: {
    databaseUrl: `postgresql://localhost:5432/${dbName}`,
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
