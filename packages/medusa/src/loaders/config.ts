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

const buildAuthConfig = (projectConfig: ConfigModule["projectConfig"]) => {
  const auth = projectConfig.auth ?? {}

  auth.jwtExpiresIn = auth?.jwtExpiresIn ?? "1d"
  auth.cors = auth.cors ?? ""

  auth.jwtSecret = auth?.jwtSecret ?? process.env.JWT_SECRET

  if (!auth.jwtSecret) {
    errorHandler(
      `[medusa-config] ⚠️ auth.jwtSecret not found.${
        isProduction ? "" : "Using default 'supersecret'."
      }`
    )

    auth.jwtSecret = "supersecret"
  }

  auth.cookieSecret =
    projectConfig.auth?.cookieSecret ?? process.env.COOKIE_SECRET

  if (!auth.cookieSecret) {
    errorHandler(
      `[medusa-config] ⚠️ auth.cookieSecret not found.${
        isProduction ? "" : " Using default 'supersecret'."
      }`
    )

    auth.cookieSecret = "supersecret"
  }

  return auth
}

const normalizeProjectConfig = (
  projectConfig: ConfigModule["projectConfig"]
) => {
  if (!projectConfig?.redis_url) {
    console.log(
      `[medusa-config] ⚠️ redis_url not found. A fake redis instance will be used.`
    )
  }

  projectConfig.auth = buildAuthConfig(projectConfig)

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

  projectConfig.admin_cors = projectConfig.admin_cors ?? ""
  projectConfig.store_cors = projectConfig.store_cors ?? ""

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
    modules: configModule.modules ?? {},
    featureFlags: configModule?.featureFlags ?? {},
    plugins: configModule?.plugins ?? [],
  }
}
