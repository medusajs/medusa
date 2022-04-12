import { ConfigModule } from "../types/global"
import { getConfigFile } from "medusa-core-utils/dist"

const isProduction = ['production', 'prod'].includes(process.env.NODE_ENV || '')

const errorHandler = isProduction ? (msg: string) => {
  throw new Error(msg)
} : console.log

export default (rootDirectory: string): ConfigModule => {
  const { configModule } = getConfigFile(rootDirectory, `medusa-config`) as {
    configModule: ConfigModule
  }

  if (!configModule?.projectConfig?.redis_url) {
    console.log(
      `[medusa-config] ⚠️ redis_url not found. A fake redis instance will be used.`
    )
  }

  if (!configModule?.projectConfig?.jwtSecret) {
    errorHandler(
      `[medusa-config] ⚠️ jwtSecret not found.${isProduction ? '' : " fallback to default 'supersecret'."}`
    )
  }

  if (!configModule?.projectConfig?.cookieSecret) {
    errorHandler(
      `[medusa-config] ⚠️ cookieSecret not found.${isProduction ? '' : " fallback to default 'supersecret'."}`
    )
  }

  if (!configModule?.projectConfig?.database_type) {
    console.log(
      `[medusa-config] ⚠️ database_type not found. fallback to default sqlite.`
    )
  }

  return {
    projectConfig: {
      jwtSecret: "supersecret",
      cookieSecret: "supersecret",
      ...configModule?.projectConfig,
    },
    plugins: configModule?.plugins ?? [],
  }
}
