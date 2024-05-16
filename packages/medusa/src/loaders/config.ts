import { ConfigModule } from "@medusajs/types"
import { getConfigFile, isDefined } from "medusa-core-utils"
import logger from "./logger"

const isProduction = ["production", "prod"].includes(process.env.NODE_ENV || "")

const errorHandler = isProduction
  ? (msg: string): never => {
      throw new Error(msg)
    }
  : console.log

export const handleConfigError = (error: Error): void => {
  logger.error(`Error in loading config: ${error.message}`)
  if (error.stack) {
    logger.error(error.stack)
  }
  process.exit(1)
}

const buildHttpConfig = (projectConfig: ConfigModule["projectConfig"]) => {
  const http = projectConfig.http ?? {}

  http.jwtExpiresIn = http?.jwtExpiresIn ?? "1d"
  http.authCors = http.authCors ?? ""
  http.storeCors = http.storeCors ?? ""
  http.adminCors = http.adminCors ?? ""

  http.jwtSecret = http?.jwtSecret ?? process.env.JWT_SECRET

  if (!http.jwtSecret) {
    errorHandler(
      `[medusa-config] ⚠️ http.jwtSecret not found.${
        isProduction ? "" : "Using default 'supersecret'."
      }`
    )

    http.jwtSecret = "supersecret"
  }

  http.cookieSecret =
    projectConfig.http?.cookieSecret ?? process.env.COOKIE_SECRET

  if (!http.cookieSecret) {
    errorHandler(
      `[medusa-config] ⚠️ http.cookieSecret not found.${
        isProduction ? "" : " Using default 'supersecret'."
      }`
    )

    http.cookieSecret = "supersecret"
  }

  return http
}

const normalizeProjectConfig = (
  projectConfig: ConfigModule["projectConfig"]
) => {
  if (!projectConfig?.redis_url) {
    console.log(
      `[medusa-config] ⚠️ redis_url not found. A fake redis instance will be used.`
    )
  }

  projectConfig.http = buildHttpConfig(projectConfig)

  let worker_mode = projectConfig?.worker_mode

  if (!isDefined(worker_mode)) {
    const env = process.env.MEDUSA_WORKER_MODE
    if (isDefined(env)) {
      if (env === "shared" || env === "worker" || env === "server") {
        worker_mode = env
      }
    } else {
      worker_mode = "shared"
    }
  }

  // Backward compatibility
  projectConfig.admin_cors = projectConfig.http.adminCors
  projectConfig.store_cors = projectConfig.http.storeCors

  return {
    ...projectConfig,
    worker_mode,
  }
}

export default (rootDirectory: string): ConfigModule => {
  const { configModule, error } = getConfigFile<ConfigModule>(
    rootDirectory,
    `medusa-config`
  )

  if (error) {
    handleConfigError(error)
  }

  const projectConfig = normalizeProjectConfig(configModule.projectConfig)

  return {
    projectConfig,
    admin: configModule?.admin ?? {},
    modules: configModule.modules ?? {},
    featureFlags: configModule?.featureFlags ?? {},
    plugins: configModule?.plugins ?? [],
  }
}
