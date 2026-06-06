import { InputConfigModules } from "@zjedene-medusa/types"
import { FeatureFlag } from "@zjedene-medusa/utils"
import { EnvFeatureFlag } from "./src/feature-flags/env-ff"

const { defineConfig } = require("@zjedene-medusa/framework/utils")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

process.env.DATABASE_URL = DB_URL

const modules = [] as InputConfigModules

// The custom feature is available here and has default value set to true
if (FeatureFlag.isFeatureEnabled(EnvFeatureFlag.key)) {
  modules.push({
    key: "custom",
    resolve: "src/modules/custom",
  })
}

module.exports = defineConfig({
  admin: {
    disable: true,
  },
  projectConfig: {
    http: {
      jwtSecret: "secret",
    },
  },
  modules,
})
