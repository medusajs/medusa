import { AwilixContainer } from "awilix"
import { Request } from "express"
import { LoggerOptions } from "typeorm"
import { Logger as _Logger } from "winston"
import { Customer, User } from "../models"
import { FindConfig, RequestQueryFields } from "./common"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: (User | Customer) & { customer_id?: string; userId?: string }
      scope: MedusaContainer
      validatedQuery: RequestQueryFields & Record<string, unknown>
      validatedBody: unknown
      listConfig: FindConfig<unknown>
      retrieveConfig: FindConfig<unknown>
      filterableFields: Record<string, unknown>
      allowedProperties: string[]
      errors: string[]
    }
  }
}

export type ExtendedRequest<TEntity> = Request & { resource: TEntity }

export type ClassConstructor<T> = {
  new (...args: unknown[]): T
}

export type MedusaContainer = AwilixContainer & {
  registerAdd: <T>(name: string, registration: T) => MedusaContainer
}

export type Logger = _Logger & {
  progress: (activityId: string, msg: string) => void
  info: (msg: string) => void
  warn: (msg: string) => void
}

export enum MODULE_SCOPE {
  INTERNAL = "internal",
  EXTERNAL = "external",
}

export enum MODULE_RESOURCE_TYPE {
  SHARED = "shared",
  ISOLATED = "isolated",
}

export type ConfigurableModuleDeclaration = {
  scope: MODULE_SCOPE.INTERNAL
  resources: MODULE_RESOURCE_TYPE
  resolve?: string
  options?: Record<string, unknown>
}
/*
| {
    scope: MODULE_SCOPE.external
    server: {
      type: "built-in" | "rest" | "tsrpc" | "grpc" | "gql"
      url: string
      options?: Record<string, unknown>
    }
  }
*/

export type ModuleResolution = {
  resolutionPath: string | false
  definition: ModuleDefinition
  options?: Record<string, unknown>
  moduleDeclaration?: ConfigurableModuleDeclaration
}

export type ModuleDefinition = {
  key: string
  registrationName: string
  defaultPackage: string | false
  label: string
  canOverride?: boolean
  isRequired?: boolean
  defaultModuleDeclaration: ConfigurableModuleDeclaration
}

export type LoaderOptions = {
  container: MedusaContainer
  configModule: ConfigModule
  options?: Record<string, unknown>
  logger?: Logger
}

export type Constructor<T> = new (...args: any[]) => T

export type ModuleExports = {
  loaders: ((
    options: LoaderOptions,
    moduleDeclaration?: ConfigurableModuleDeclaration
  ) => Promise<void>)[]
  service: Constructor<any>
  migrations?: any[] // TODO: revisit migrations type
  models?: Constructor<any>[]
}

type SessionOptions = {
  name?: string
  resave?: boolean
  rolling?: boolean
  saveUninitialized?: boolean
  secret?: string
  ttl?: number
}


export type ConfigModule = {

  /**
   * The project wide configuration
   */
  projectConfig: {
    /**
     * ## Redis URL
     * The URL to the redis instance to use.
     * 
     * ### Example
     * ```js
     * {
     *    // Other configurations,
     *    redis_url: "redis://localhost:6379",
     * }
     * ```
     * 
     * @see https://docs.medusajs.com/usage/configurations/#redis
     */
    redis_url?: string

    
    session_options?: SessionOptions

    /**
     * ## JWT Secret
     * The secret used to sign JWT tokens.
     * 
     * @default ```supersecret``` (in development environment)
     * @see https://docs.medusajs.com/usage/configurations/#jwt-secret
     */
    jwt_secret?: string

    /**
     * ## Cookie Secret
     * The secret used to sign the session ID cookies.
     * 
     * @default ```supersecret``` (in development environment)
     * @see https://docs.medusajs.com/usage/configurations/#cookie-secret
     */
    cookie_secret?: string

    /**
     * ## Database URL
     * The URL to the **PostgreSQL** database to use.
     * 
     * ### Example
     * ```js
     * {
     *    // Other configurations,
     *    database_type: "postgres",
     *    database_url: process.env.DATABASE_URL || "postgres://localhost:5432/medusa",
     * }
     * ```
     * 
     * @see https://docs.medusajs.com/usage/configurations/#postgresql-configurations
     */
    database_url?: string

    /**
     * ## Database Type
     * The type of database to use between : ```sqlite``` or ```postgres```.
     * 
     * ### Example
     * ```js
     * {
     *    // Other configurations,
     *    database_type: "postgres",
     *    database_url: process.env.DATABASE_URL || "postgres://localhost:5432/medusa",
     * }
     * ```
     * 
     * @see https://docs.medusajs.com/usage/configurations/#sqlite-configurations
     */
    database_type: string

    /**
     * ## Database Location
     * The location of the SQLite database file.
     * 
     * ### Example
     * ```js
     * {
     *    // Other configurations,
     *    database_type: "sqlite",
     *    database_database: "./medusa-db.sql",
     * }
     * ```
     * 
     * @see https://docs.medusajs.com/usage/configurations/#sqlite-configurations
     */
    database_database?: string


    /**
     * # DEPRECATED
     * ## Custom Database Schema
     * This is a deprecated option. Please use `search_path` option inside your database URL.
     * 
     * @deprecated
     * @default ```public```
     * @see https://github.com/medusajs/medusa/blob/master/docs/content/usage/configurations.md#changing-postgresql-schema
     */
    database_schema?: string

    /**
     * ## Database Logging
     * The logging configuration for the database.
     * 
     * @see https://docs.medusajs.com/usage/configurations/#common-configuration
     */
    database_logging: LoggerOptions

    /**
     * ## Database Extra
     * Extra configuration for the database.
     * 
     * @see https://docs.medusajs.com/usage/configurations/#common-configuration
     */
    database_extra?: Record<string, unknown> & {
      ssl: { rejectUnauthorized: false }
    }


    /**
     * ## Store URL
     * The accepted origin for the store API.
     * 
     * 
     * ### Example
     * ```js
     * const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000"
     * ```
     * 
     * @default ```http://localhost:8000```
     * @see https://docs.medusajs.com/usage/configurations/#storefront-cors
     */
    store_cors?: string

    /**
     * ## Admin URL
     * The accepted origin for the admin API.
     *  
     * ### Example
     * ```js
     * const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:3000"
     * ```
     * 
     * @default ```http://localhost:7000```
     * @see https://docs.medusajs.com/usage/configurations/#admin-cors
     */
    admin_cors?: string
  }

  /**
   * ## Feature Flags
   * Feature flags can be used to enable or disable certain features in Medusa.
   * 
   * ### Example
   * ```js
   * {
   *    featureFlags: {
   *      sales_channels : false // Disable the sales channels feature
   *    }
   * }
   * ```
   * 
   * @see https://docs.medusajs.com/advanced/backend/feature-flags/toggle
   */
  featureFlags: Record<string, boolean | string>


  /**
   * ## Modules configuration
   * This can be used to configure loaded modules inside the container.
   * 
   * Modules can be enabled, disabled or configured :
   * 
   * - A `false` value will disable the module.
   * - A `string` value will be treated as the path to the overriding module.
   * - A `Partial<ConfigurableModuleDeclaration>` value will be used to configure the module.
   * 
   * 
   * ### Example
   * ```js
   * {
   *    modules: {
   *      inventoryService: false, // Module will not be loaded
   *      stockLocationService: "./my-custom-stock-location-service", // Module will be loaded from the given path
   *    }
   * }
   * ```
   */
  modules?: Record<
    string,
    false | string | Partial<ConfigurableModuleDeclaration>
  >


  /**
   * ## Module Resolutions
   * This refers to a collection of modules to be loaded and registered within the application container.
   * 
   * @see https://github.com/jeffijoe/awilix#readme
   */
  moduleResolutions?: Record<string, ModuleResolution>

  /**
   * ## Plugins
   * This refers to a collection of plugins to be loaded and registered within the app.
   * 
   * ### Example
   * ```js
   * {
   *    plugins: [
   *    'medusa-fulfillment-manual',
   *    'medusa-payment-manual',
   *    {
   *      resolve: 'medusa-payment-stripe',
   *      options: {
   *        api_key: process.env.STRIPE_API_KEY,
   *        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
   *      },
   *    },
   *    ]
   * }
   * ```
   * 
   * @see https://docs.medusajs.com/advanced/backend/plugins/overview
   */
  plugins: (
    | {
        resolve: string
        options: Record<string, unknown>
      }
    | string
  )[]
}
