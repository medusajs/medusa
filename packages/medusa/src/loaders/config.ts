import resolveCwd from "resolve-cwd"
import { ConfigModule } from "../types/global"
import { getConfigFile } from "medusa-core-utils/dist"

const isProduction = ["production", "prod"].includes(process.env.NODE_ENV || "")

const errorHandler = isProduction
  ? (msg: string): never => {
      throw new Error(msg)
    }
  : console.log

export const MODULE_DEFINITION = {
  stockLocation: {
    registration: "stockLocationService",
    defaultPackage: "@medusajs/stock-locations",
    label: "StockLocationService",
    validation: (proto: any): boolean => {
      return true
    },
    required: false,
    canOverride: true,
  },
  inventory: {
    registration: "inventoryService",
    defaultPackage: "@medusajs/inventory",
    label: "InventoryService",
    validation: (proto: any): boolean => {
      return true
    },
    required: false,
    canOverride: true,
  },
}

export default (rootDirectory: string): ConfigModule => {
  const { configModule } = getConfigFile(rootDirectory, `medusa-config`) as {
    configModule: ConfigModule
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

  if (!configModule?.projectConfig?.database_type) {
    console.log(
      `[medusa-config] ⚠️ database_type not found. fallback to default sqlite.`
    )
  }

  const moduleResolutions = {}
  const projectModules = configModule.modules ?? {}
  for (const [moduleKey, settings] of Object.entries(MODULE_DEFINITION)) {
    let resolutionPath = settings.defaultPackage
    if (settings.canOverride && moduleKey in projectModules) {
      resolutionPath = resolveCwd(projectModules[moduleKey])
    }

    moduleResolutions[moduleKey] = {
      resolutionPath,
      settings,
    }
  }

  return {
    projectConfig: {
      jwt_secret: jwt_secret ?? "supersecret",
      cookie_secret: cookie_secret ?? "supersecret",
      ...configModule?.projectConfig,
    },
    modules: configModule.modules ?? {},
    moduleResolutions,
    featureFlags: configModule?.featureFlags ?? {},
    plugins: configModule?.plugins ?? [],
  }
}
