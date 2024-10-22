import {
  ConfigModule,
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
} from "@medusajs/types"
import {
  MODULE_PACKAGE_NAMES,
  Modules,
  REVERSED_MODULE_PACKAGE_NAMES,
} from "../modules-sdk"
import { isObject } from "./is-object"
import { isString } from "./is-string"
import { normalizeImportPathWithSource } from "./normalize-import-path-with-source"
import { resolveExports } from "./resolve-exports"

const DEFAULT_SECRET = "supersecret"
const DEFAULT_ADMIN_URL = "http://localhost:9000"
const DEFAULT_STORE_CORS = "http://localhost:8000"
const DEFAULT_DATABASE_URL = "postgres://localhost/medusa-starter-default"
const DEFAULT_ADMIN_CORS =
  "http://localhost:7000,http://localhost:7001,http://localhost:5173"

export const DEFAULT_STORE_RESTRICTED_FIELDS = [
  "order",
  "orders",
  /*"customer",
  "customers",
  "payment_collection",
  "payment_collections"*/
]

type InternalModuleDeclarationOverride = InternalModuleDeclaration & {
  /**
   * Optional key to be used to identify the module, if not provided, it will be inferred from the module joiner config service name.
   */
  key?: string
  /**
   * By default, modules are enabled, if provided as true, this will disable the module entirely.
   */
  disable?: boolean
}

type ExternalModuleDeclarationOverride = ExternalModuleDeclaration & {
  /**
   * key to be used to identify the module, if not provided, it will be inferred from the module joiner config service name.
   */
  key: string
  /**
   * By default, modules are enabled, if provided as true, this will disable the module entirely.
   */
  disable?: boolean
}

type Config = Partial<
  Omit<ConfigModule, "admin" | "modules"> & {
    admin: Partial<ConfigModule["admin"]>
    modules:
      | Partial<
          InternalModuleDeclarationOverride | ExternalModuleDeclarationOverride
        >[]
      /**
       * @deprecated use the array instead
       */
      | ConfigModule["modules"]
  }
>

/**
 * The "defineConfig" helper can be used to define the configuration
 * of a medusa application.
 *
 * The helper under the hood merges your config with a set of defaults to
 * make an application work seamlessly, but still provide you the ability
 * to override configuration as needed.
 */
export function defineConfig(config: Config = {}): ConfigModule {
  const { http, ...restOfProjectConfig } = config.projectConfig || {}

  /**
   * The defaults to use for the project config. They are shallow merged
   * with the user defined config. However,
   */
  const projectConfig: ConfigModule["projectConfig"] = {
    databaseUrl: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || DEFAULT_STORE_CORS,
      adminCors: process.env.ADMIN_CORS || DEFAULT_ADMIN_CORS,
      authCors: process.env.AUTH_CORS || DEFAULT_ADMIN_CORS,
      jwtSecret: process.env.JWT_SECRET || DEFAULT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET || DEFAULT_SECRET,
      restrictedFields: {
        store: DEFAULT_STORE_RESTRICTED_FIELDS,
      },
      ...http,
    },
    ...restOfProjectConfig,
  }

  /**
   * The defaults to use for the admin config.  They are shallow merged
   * with the user defined config
   */
  const admin: ConfigModule["admin"] = {
    backendUrl: process.env.MEDUSA_BACKEND_URL || DEFAULT_ADMIN_URL,
    path: "/app",
    ...config.admin,
  }

  /**
   * The defaults to use for the feature flags config. They are shallow merged
   * with the user defined config
   */
  const featureFlags: ConfigModule["featureFlags"] = {
    ...config.featureFlags,
  }

  const modules = resolveModules(config.modules)

  return {
    projectConfig,
    featureFlags,
    plugins: config.plugins || [],
    admin,
    modules: modules,
  }
}

/**
 * The user API allow to use array of modules configuration. This method manage the loading of the user modules
 * along side the default modules and re map them to an object.
 *
 * @param configModules
 */
function resolveModules(
  configModules: Config["modules"]
): ConfigModule["modules"] {
  /**
   * The default set of modules to always use. The end user can swap
   * the modules by providing an alternate implementation via their
   * config. But they can never remove a module from this list.
   */
  const modules: Config["modules"] = [
    { resolve: MODULE_PACKAGE_NAMES[Modules.CACHE] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.EVENT_BUS] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.WORKFLOW_ENGINE] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.LOCKING] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.STOCK_LOCATION] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.INVENTORY] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.PRODUCT] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.PRICING] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.PROMOTION] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.CUSTOMER] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.SALES_CHANNEL] },

    { resolve: MODULE_PACKAGE_NAMES[Modules.CART] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.REGION] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.API_KEY] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.STORE] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.TAX] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.CURRENCY] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.PAYMENT] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.ORDER] },

    {
      resolve: MODULE_PACKAGE_NAMES[Modules.AUTH],
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
          },
        ],
      },
    },
    {
      resolve: MODULE_PACKAGE_NAMES[Modules.USER],
      options: {
        jwt_secret: process.env.JWT_SECRET ?? DEFAULT_SECRET,
      },
    },
    {
      resolve: MODULE_PACKAGE_NAMES[Modules.FILE],
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
          },
        ],
      },
    },
    {
      resolve: MODULE_PACKAGE_NAMES[Modules.FULFILLMENT],
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/fulfillment-manual",
            id: "manual",
          },
        ],
      },
    },
    {
      resolve: MODULE_PACKAGE_NAMES[Modules.NOTIFICATION],
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-local",
            id: "local",
            options: {
              name: "Local Notification Provider",
              channels: ["feed"],
            },
          },
        ],
      },
    },
  ]

  /**
   * Backward compatibility for the old way of defining modules (object vs array)
   */
  if (configModules) {
    if (isObject(configModules)) {
      const modules_ = (configModules ??
        {}) as unknown as Required<ConfigModule>["modules"]

      Object.entries(modules_).forEach(([key, moduleConfig]) => {
        modules.push({
          key,
          ...(isObject(moduleConfig)
            ? moduleConfig
            : { disable: !moduleConfig }),
        })
      })
    } else if (Array.isArray(configModules)) {
      const modules_ = (configModules ?? []) as InternalModuleDeclaration[]
      modules.push(...modules_)
    } else {
      throw new Error(
        "Invalid modules configuration. Should be an array or object."
      )
    }
  }

  const remappedModules = modules.reduce((acc, moduleConfig) => {
    if (moduleConfig.scope === "external" && !moduleConfig.key) {
      throw new Error(
        "External modules configuration must have a 'key'. Please provide a key for the module."
      )
    }

    if ("disable" in moduleConfig && "key" in moduleConfig) {
      acc[moduleConfig.key!] = moduleConfig
    }

    // TODO: handle external modules later
    let serviceName: string =
      "key" in moduleConfig && moduleConfig.key ? moduleConfig.key : ""
    delete moduleConfig.key

    if (!serviceName && "resolve" in moduleConfig) {
      if (
        isString(moduleConfig.resolve!) &&
        REVERSED_MODULE_PACKAGE_NAMES[moduleConfig.resolve!]
      ) {
        serviceName = REVERSED_MODULE_PACKAGE_NAMES[moduleConfig.resolve!]
        acc[serviceName] = moduleConfig
        return acc
      }

      let resolution = isString(moduleConfig.resolve!)
        ? normalizeImportPathWithSource(moduleConfig.resolve as string)
        : moduleConfig.resolve

      const moduleExport = isString(resolution)
        ? require(resolution)
        : resolution

      const defaultExport = resolveExports(moduleExport).default

      const joinerConfig =
        typeof defaultExport.service.prototype.__joinerConfig === "function"
          ? defaultExport.service.prototype.__joinerConfig() ?? {}
          : defaultExport.service.prototype.__joinerConfig ?? {}

      serviceName = joinerConfig.serviceName

      if (!serviceName) {
        throw new Error(
          `Module ${moduleConfig.resolve} doesn't have a serviceName. Please provide a 'key' for the module or check the service joiner config.`
        )
      }
    }

    acc[serviceName] = moduleConfig

    return acc
  }, {})

  // Remove any modules set to false
  Object.keys(remappedModules).forEach((key) => {
    if (remappedModules[key].disable) {
      delete remappedModules[key]
    }
  })

  return remappedModules as ConfigModule["modules"]
}
