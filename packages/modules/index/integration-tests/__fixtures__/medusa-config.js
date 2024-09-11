const { defineConfig, Modules } = require("@medusajs/utils")
const { schema } = require("./schema")

const config = defineConfig({})

Object.keys(config.modules).forEach((key) => {
  if ([Modules.EVENT_BUS].includes(key)) {
    return
  }

  config.modules[key] = false
})

config.modules[Modules.INDEX] = {
  resolve: "@medusajs/index",
  options: {
    schema,
  },
}

config.modules[Modules.PRODUCT] = true
config.modules[Modules.PRICING] = true

export default config
