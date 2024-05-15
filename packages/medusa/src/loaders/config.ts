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

export default (rootDirectory: string): ConfigModule => {
  const { configModule, error } = getConfigFile<ConfigModule>(
    rootDirectory,
    `medusa-config`
  )

  if (error) {
    handleConfigError(error)
  }

  if (!configModule?.projectConfig?.redis_url) {
    console.log(
      `[medusa-config] ⚠️ redis_url not found. A fake redis instance will be used.`
    )
  }

  configModule.projectConfig.auth = buildAuthConfig(configModule.projectConfig)

  let worker_mode = configModule?.projectConfig?.worker_mode
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

  return {
    projectConfig: {
      // Question: Should we just introduce the breaking change now, or do we want to stay backward compatible?
      jwt_secret: configModule.projectConfig.auth.jwtSecret,
      cookie_secret: configModule.projectConfig.auth.cookieSecret,
      ...configModule?.projectConfig,
      worker_mode,
    },
    modules: configModule.modules ?? {},
    featureFlags: configModule?.featureFlags ?? {},
    plugins: configModule?.plugins ?? [],
  }
}
