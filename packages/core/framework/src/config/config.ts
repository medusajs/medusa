import { ConfigModule } from "./types"
import { deepCopy, isDefined } from "@medusajs/utils"
import { logger } from "../logger"

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
    projectConfig: Partial<ConfigModule["projectConfig"]>
  ): ConfigModule["projectConfig"]["http"] {
    const http = (projectConfig.http ??
      {}) as ConfigModule["projectConfig"]["http"]

    http.jwtExpiresIn = http?.jwtExpiresIn ?? "1d"
    http.authCors = http.authCors ?? ""
    http.storeCors = http.storeCors ?? ""
    http.adminCors = http.adminCors ?? ""

    http.jwtSecret = http?.jwtSecret ?? process.env.JWT_SECRET

    if (!http.jwtSecret) {
      this.rejectErrors(
        `http.jwtSecret not found.${
          this.#isProduction ? "" : "Using default 'supersecret'."
        }`
      )

      http.jwtSecret = "supersecret"
    }

    http.cookieSecret = (projectConfig.http?.cookieSecret ??
      process.env.COOKIE_SECRET)!

    if (!http.cookieSecret) {
      this.rejectErrors(
        `http.cookieSecret not found.${
          this.#isProduction ? "" : " Using default 'supersecret'."
        }`
      )

      http.cookieSecret = "supersecret"
    }

    return http
  }

  /**
   * Normalizes the project config object and assign the defaults if needed
   * @param projectConfig
   * @protected
   */
  protected normalizeProjectConfig(
    projectConfig: Partial<ConfigModule["projectConfig"]>
  ): ConfigModule["projectConfig"] {
    const outputConfig = deepCopy(
      projectConfig
    ) as ConfigModule["projectConfig"]

    if (!outputConfig?.redisUrl) {
      console.log(`redisUrl not found. A fake redis instance will be used.`)
    }

    outputConfig.http = this.buildHttpConfig(projectConfig)

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
  }: {
    projectConfig: Partial<ConfigModule>
    baseDir: string
  }): ConfigModule {
    this.#baseDir = baseDir

    const normalizedProjectConfig = this.normalizeProjectConfig(
      projectConfig.projectConfig ?? {}
    )

    this.#config = {
      projectConfig: normalizedProjectConfig,
      admin: projectConfig.admin ?? {},
      modules: projectConfig.modules ?? {},
      featureFlags: projectConfig.featureFlags ?? {},
      plugins: projectConfig.plugins ?? [],
    }

    return this.#config
  }
}
