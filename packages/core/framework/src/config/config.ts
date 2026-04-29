import { deepCopy, isDefined } from "@medusajs/utils"
import { logger } from "../logger"
import { ConfigModule } from "./types"

export class ConfigManager {
  /**
   * Root dir from where to start
   * @private
   */
  #baseDir: string

  /**
   * A flag to specify if we are in production or not, determine whether an error would be critical and thrown or just logged as a warning in developement
   * @private
   */
  get #isProduction(): boolean {
    return ["production", "prod"].includes(process.env.NODE_ENV || "")
  }

  /**
   * The worker mode
   * @private
   */
  get #envWorkMode(): ConfigModule["projectConfig"]["workerMode"] {
    return process.env
      .MEDUSA_WORKER_MODE as ConfigModule["projectConfig"]["workerMode"]
  }

  /**
   * The config object after loading it
   * @private
   */
  #config!: ConfigModule

  get config(): ConfigModule {
    if (!this.#config) {
      this.rejectErrors(
        `Config not loaded. Make sure the config have been loaded first using the 'configLoader' or 'configManager.loadConfig'.`
      )
    }
    return this.#config
  }

  get baseDir(): string {
    return this.#baseDir
  }

  get isProduction(): boolean {
    return this.#isProduction
  }

  constructor() {}

  /**
   * Rejects an error either by throwing when in production or by logging the error as a warning
   * @param error
   * @protected
   */
  protected rejectErrors(error: string): never | void {
    if (this.#isProduction) {
      throw new Error(`[config] ⚠️ ${error}`)
    }

    logger.warn(error)
  }

  /**
   * Builds the http config object and assign the defaults if needed
   * @param projectConfig
   * @protected
   */
  protected buildHttpConfig(
    projectConfig: Partial<ConfigModule["projectConfig"]>,
    options?: {
      throwOnError?: boolean
    }
  ): ConfigModule["projectConfig"]["http"] {
    const { throwOnError = true } = options ?? {}
    const http = (projectConfig.http ??
      {}) as ConfigModule["projectConfig"]["http"]

    http.jwtExpiresIn = http?.jwtExpiresIn ?? "1d"
    http.authCors = http.authCors ?? ""
    http.storeCors = http.storeCors ?? ""
    http.adminCors = http.adminCors ?? ""

    http.jwtOptions ??= {}
    http.jwtOptions.expiresIn = http.jwtExpiresIn

    http.jwtSecret = http?.jwtSecret ?? process.env.JWT_SECRET
    http.jwtPublicKey = http?.jwtPublicKey ?? process.env.JWT_PUBLIC_KEY

    if (
      throwOnError &&
      http?.jwtPublicKey &&
      ((http.jwtVerifyOptions && !http.jwtVerifyOptions.algorithms?.length) ||
        (http.jwtOptions && !http.jwtOptions.algorithm))
    ) {
      this.rejectErrors(
        `JWT public key is provided but no algorithm is set in the 'jwtVerifyOptions' or 'jwtOptions' if 'jwtVerifyOptions' is not provided. It means that the algorithm will be inferred from the public key which can lead to missmatch and invalid algorithm errors.`
      )
    }

    if (!http.jwtSecret) {
      if (throwOnError) {
        this.rejectErrors(
          `http.jwtSecret not found.${
            this.#isProduction ? "" : "Using default 'supersecret'."
          }`
        )
      }

      http.jwtSecret = "supersecret"
    }

    http.cookieSecret = (projectConfig.http?.cookieSecret ??
      process.env.COOKIE_SECRET)!

    if (!http.cookieSecret) {
      if (throwOnError) {
        this.rejectErrors(
          `http.cookieSecret not found.${
            this.#isProduction ? "" : " Using default 'supersecret'."
          }`
        )
      }

      http.cookieSecret = "supersecret"
    }

    return http
  }

  /**
   * Normalizes the project config object and assign the defaults if needed
   * @param config
   * @protected
   */
  protected normalizeProjectConfig(
    config: Partial<ConfigModule>,
    options?: {
      throwOnError?: boolean
    }
  ): ConfigModule["projectConfig"] {
    const projConfig = config?.projectConfig ?? {}
    const outputConfig = deepCopy(projConfig) as ConfigModule["projectConfig"]

    if (!outputConfig?.redisUrl) {
      const customLogger = config?.logger ?? logger
      customLogger.log(
        `redisUrl not found. A fake redis instance will be used.`
      )
    }

    outputConfig.http = this.buildHttpConfig(projConfig, {
      throwOnError: options?.throwOnError,
    })

    let workerMode = outputConfig?.workerMode!

    if (!isDefined(workerMode)) {
      const env = this.#envWorkMode
      if (isDefined(env)) {
        const workerModes = ["shared", "worker", "server"]
        if (workerModes.includes(env)) {
          workerMode = env
        }
      } else {
        workerMode = "shared"
      }
    }

    return {
      ...outputConfig,
      workerMode,
    }
  }

  /**
   * Prepare the full configuration after validation and normalization
   */
  loadConfig({
    projectConfig = {},
    baseDir,
    throwOnError = true,
  }: {
    projectConfig: Partial<ConfigModule>
    baseDir: string
    throwOnError?: boolean
  }): ConfigModule {
    this.#baseDir = baseDir

    const normalizedProjectConfig = this.normalizeProjectConfig(projectConfig, {
      throwOnError,
    })

    this.#config = {
      projectConfig: normalizedProjectConfig,
      admin: projectConfig.admin ?? {
        path: "/app",
      },
      modules: projectConfig.modules ?? {},
      featureFlags: projectConfig.featureFlags ?? {},
      plugins: projectConfig.plugins ?? [],
      logger: projectConfig.logger ?? logger,
    }

    return this.#config
  }
}
