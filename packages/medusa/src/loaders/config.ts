import { getConfigFile, isDefined } from "medusa-core-utils"
import { ConfigModule } from "../types/global"
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

  const jwt_secret =
    configModule?.projectConfig?.jwt_secret ?? process.env.JWT_SECRET
  if (!jwt_secret) {
    errorHandler(
      `[medusa-config] ⚠️ jwt_secret not found.${
        isProduction
          ? ""
          : " fallback to either cookie_secret or default 'supersecret'."
      }`
    )
  }

  const cookie_secret =
    configModule?.projectConfig?.cookie_secret ?? process.env.COOKIE_SECRET
  if (!cookie_secret) {
    errorHandler(
      `[medusa-config] ⚠️ cookie_secret not found.${
        isProduction
          ? ""
          : " fallback to either cookie_secret or default 'supersecret'."
      }`
    )
  }

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
      jwt_secret: jwt_secret ?? "supersecret",
      cookie_secret: cookie_secret ?? "supersecret",
      ...configModule?.projectConfig,
      worker_mode,
    },
    modules: configModule.modules ?? {},
    featureFlags: configModule?.featureFlags ?? {},
    plugins: configModule?.plugins ?? [],
  }
}
