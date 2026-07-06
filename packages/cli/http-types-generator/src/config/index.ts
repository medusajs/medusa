import path from "path"
import { existsSync, readFileSync } from "fs"

export interface HttpTypesConfig {
  /** Glob patterns keyed by area name (e.g. "admin", "store"), relative to project root */
  validatorGlobs: Record<string, string>
  /** Root directory for generated HTTP type files, relative to project root */
  outputBase: string
  /** tsconfig filename to look up from project root */
  tsconfig: string
  /** Source paths for generated import statements (package names or project-root-relative paths) */
  importSources: {
    /** Module exporting FindParams, SelectParams */
    commonRequest: string
    /** Module exporting BaseFilterable, OperatorMap */
    dal: string
  }
  /** Regex string (no surrounding slashes) that captures (area, routeDir) from a validator path */
  validatorPathPattern: string
  /** Only schemas whose export name starts with one of these prefixes are processed */
  publicPrefixes: string[]
}

export interface ResolvedHttpTypesConfig extends HttpTypesConfig {
  /** Absolute path to the project root (process.cwd()) */
  projectRoot: string
}

export class Config {
  /** Package defaults — used when no http-types.config.json is present */
  static readonly DEFAULTS: HttpTypesConfig = {
    validatorGlobs: {
      admin: "**/api/admin/*/validators.ts",
      store: "**/api/store/*/validators.ts",
    },
    outputBase: "src/types/http",
    tsconfig: "tsconfig.json",
    importSources: {
      commonRequest: "@medusajs/framework/types",
      dal: "@medusajs/framework/types",
    },
    validatorPathPattern: "/api/([^/]+)/([^/]+)/validators\\.ts$",
    publicPrefixes: ["Admin", "Store"],
  }

  private static readonly CONFIG_FILE_NAME = "http-types.config.json"

  private static _instance: ResolvedHttpTypesConfig | null = null

  /**
   * Walks up the directory tree from `startDir` to find the nearest ancestor
   * (inclusive) that contains `http-types.config.json`. Returns the directory
   * path and parsed contents, or `undefined` if the file is not found.
   */
  private static findConfigFile(
    startDir: string
  ): { dir: string; config: Partial<HttpTypesConfig> } | undefined {
    let dir = startDir
    while (true) {
      const candidate = path.join(dir, Config.CONFIG_FILE_NAME)
      if (existsSync(candidate)) {
        try {
          const raw = readFileSync(candidate, "utf-8")
          return { dir, config: JSON.parse(raw) as Partial<HttpTypesConfig> }
        } catch {
          console.warn(
            `Warning: could not parse ${candidate}, using default config`
          )
          return { dir, config: {} }
        }
      }
      const parent = path.dirname(dir)
      if (parent === dir) break
      dir = parent
    }
    return undefined
  }

  /**
   * Builds a resolved config by deep-merging `override` over DEFAULTS.
   * When `override` is provided the config file is not read and `projectRoot`
   * is set to `process.cwd()`. When omitted, the nearest `http-types.config.json`
   * is found by searching upward from `process.cwd()`; its directory becomes
   * `projectRoot`. Falls back to `process.cwd()` when no config file is found.
   */
  static load(override?: Partial<HttpTypesConfig>): ResolvedHttpTypesConfig {
    let projectRoot = process.cwd()
    let userConfig: Partial<HttpTypesConfig>

    if (override !== undefined) {
      userConfig = override
    } else {
      const found = Config.findConfigFile(process.cwd())
      if (found) {
        projectRoot = found.dir
        userConfig = found.config
      } else {
        userConfig = {}
      }
    }

    Config._instance = {
      projectRoot,
      validatorGlobs: {
        ...Config.DEFAULTS.validatorGlobs,
        ...(userConfig.validatorGlobs ?? {}),
      },
      outputBase: userConfig.outputBase ?? Config.DEFAULTS.outputBase,
      tsconfig: userConfig.tsconfig ?? Config.DEFAULTS.tsconfig,
      importSources: {
        ...Config.DEFAULTS.importSources,
        ...(userConfig.importSources ?? {}),
      },
      validatorPathPattern: (() => {
        const pattern =
          userConfig.validatorPathPattern ?? Config.DEFAULTS.validatorPathPattern
        try {
          new RegExp(pattern)
        } catch {
          throw new Error(
            `validatorPathPattern in http-types.config.json is not a valid regex: "${pattern}"`
          )
        }
        return pattern
      })(),
      publicPrefixes:
        userConfig.publicPrefixes ?? Config.DEFAULTS.publicPrefixes,
    }

    return Config._instance
  }

  /**
   * Returns the cached config, loading it from the config file on first call.
   */
  static get(): ResolvedHttpTypesConfig {
    if (!Config._instance) {
      return Config.load()
    }
    return Config._instance
  }

  /**
   * Resets the cached config singleton. Primarily used in tests.
   */
  static reset(): void {
    Config._instance = null
  }
}
