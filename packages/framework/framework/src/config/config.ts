import { ConfigModule } from "./types"
import { deepCopy, isDefined } from "@medusajs/utils"

export class ConfigManager {
  readonly #inputConfig: Partial<ConfigModule>
  readonly #isProduction: boolean = true
  readonly #envWorkMode?: ConfigModule["projectConfig"]["workerMode"]

  #config!: ConfigModule

  constructor(
    rawConfig: Partial<ConfigModule> = {},
    {
      isProduction,
      envWorkMode,
    }: {
      isProduction?: boolean
      envWorkMode?: ConfigModule["projectConfig"]["workerMode"]
    }
  ) {
    this.#inputConfig = rawConfig
    this.#isProduction = isProduction ?? false
    this.#envWorkMode = envWorkMode
  }

  protected rejectErrors(error: string): never | void {
    if (this.#isProduction) {
      throw new Error(error)
    }

    console.log(error)
  }

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
        `[medusa-config] ⚠️ http.jwtSecret not found.${
          this.#isProduction ? "" : "Using default 'supersecret'."
        }`
      )

      http.jwtSecret = "supersecret"
    }

    http.cookieSecret = (projectConfig.http?.cookieSecret ??
      process.env.COOKIE_SECRET)!

    if (!http.cookieSecret) {
      this.rejectErrors(
        `[medusa-config] ⚠️ http.cookieSecret not found.${
          this.#isProduction ? "" : " Using default 'supersecret'."
        }`
      )

      http.cookieSecret = "supersecret"
    }

    return http
  }

  protected normalizeProjectConfig(
    projectConfig: Partial<ConfigModule["projectConfig"]>
  ): ConfigModule["projectConfig"] {
    const outputConfig: ConfigModule["projectConfig"] = deepCopy(projectConfig)

    if (!outputConfig?.redisUrl) {
      console.log(
        `[medusa-config] ⚠️ redisUrl not found. A fake redis instance will be used.`
      )
    }

    outputConfig.http = this.buildHttpConfig(projectConfig)

    let workedMode = outputConfig?.workerMode!

    if (!isDefined(workedMode)) {
      const env = this.#envWorkMode
      if (isDefined(env)) {
        const workerModes = ["shared", "worker", "server"]
        if (workerModes.includes(env)) {
          workedMode = env
        }
      } else {
        workedMode = "shared"
      }
    }

    return {
      ...outputConfig,
      workerMode: workedMode,
    }
  }

  protected loadConfig(): ConfigModule {
    const projectConfig = this.normalizeProjectConfig(
      this.#inputConfig.projectConfig ?? {}
    )

    return {
      projectConfig,
      admin: this.#inputConfig.admin ?? {},
      modules: this.#inputConfig.modules ?? {},
      featureFlags: this.#inputConfig.featureFlags ?? {},
      plugins: this.#inputConfig.plugins ?? [],
    }
  }

  getConfig(): ConfigModule {
    return this.#config ?? (this.#config = this.loadConfig())
  }
}
