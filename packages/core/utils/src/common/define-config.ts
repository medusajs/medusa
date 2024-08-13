import { ConfigModule } from "@medusajs/types"
import { Modules } from "../modules-sdk/definition"

const DEFAULT_SECRET = "supersecret"
const DEFAULT_ADMIN_URL = "http://localhost:9000"
const DEFAULT_STORE_CORS = "http://localhost:8000"
const DEFAULT_DATABASE_URL = "postgres://localhost/medusa-starter-default"
const DEFAULT_ADMIN_CORS =
  "http://localhost:7000,http://localhost:7001,http://localhost:5173"

/**
 * The "defineConfig" helper can be used to define the configuration
 * of a medusa application.
 *
 * The helper under the hood merges your config with a set of defaults to
 * make an application work seamlessly, but still provide you the ability
 * to override configuration as needed.
 */
export function defineConfig(config: Partial<ConfigModule> = {}): ConfigModule {
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
      ...http,
    },
    ...restOfProjectConfig,
  }

  /**
   * The defaults to use for the admin config.  They are shallow merged
   * with the user defined config
   */
  const admin: ConfigModule["admin"] = {
    backendUrl: DEFAULT_ADMIN_URL,
    ...config.admin,
  }

  /**
   * The defaults to use for the feature flags config. They are shallow merged
   * with the user defined config
   */
  const featureFlags: ConfigModule["featureFlags"] = {
    ...config.featureFlags,
  }

  /**
   * The default set of modules to always use. The end user can swap
   * the modules by providing an alternate implementation via their
   * config. But they can never remove a module from this list.
   */
  const modules: ConfigModule["modules"] = {
    [Modules.CACHE]: true,
    [Modules.EVENT_BUS]: true,
    [Modules.WORKFLOW_ENGINE]: true,
    [Modules.STOCK_LOCATION]: true,
    [Modules.INVENTORY]: true,
    [Modules.PRODUCT]: true,
    [Modules.PRICING]: true,
    [Modules.PROMOTION]: true,
    [Modules.CUSTOMER]: true,
    [Modules.SALES_CHANNEL]: true,
    [Modules.CART]: true,
    [Modules.REGION]: true,
    [Modules.API_KEY]: true,
    [Modules.STORE]: true,
    [Modules.TAX]: true,
    [Modules.CURRENCY]: true,
    [Modules.PAYMENT]: true,
    [Modules.ORDER]: true,
    [Modules.AUTH]: {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
          },
        ],
      },
    },

    [Modules.USER]: {
      resolve: "@medusajs/user",
      options: {
        jwt_secret: process.env.JWT_SECRET ?? DEFAULT_SECRET,
      },
    },
    [Modules.FILE]: {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local-next",
            id: "local",
          },
        ],
      },
    },
    [Modules.FULFILLMENT]: {
      resolve: "@medusajs/fulfillment",
      options: {
        providers: [
          {
            resolve: "@medusajs/fulfillment-manual",
            id: "manual",
          },
        ],
      },
    },
    [Modules.NOTIFICATION]: {
      resolve: "@medusajs/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/notification-local",
            id: "local",
            options: {
              name: "Local Notification Provider",
              channels: ["feed"],
            },
          },
        ],
      },
    },
    ...config.modules,
  }

  // Remove any modules set to false
  Object.keys(modules).forEach((key) => {
    if (modules[key] === false) {
      delete modules[key]
    }
  })

  return {
    projectConfig,
    featureFlags,
    plugins: config.plugins || [],
    admin,
    modules,
  }
}
