import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
} from "../modules-sdk"

import type { RedisOptions } from "ioredis"
import type { LoggerOptions } from "typeorm"
import type { InlineConfig } from "vite"

/**
 * @interface
 *
 * Admin dashboard configurations.
 */
export type AdminOptions = {
  /**
   * Whether to disable the admin dashboard. If set to `true`, the admin dashboard is disabled,
   * in both development and production environments. The default value is `false`.
   */
  disable?: boolean
  /**
   * The path to the admin dashboard. The default value is `/app`.
   *
   * The value cannot be one of the reserved paths:
   * - `/admin`
   * - `/store`
   * - `/auth`
   * - `/`
   */
  path?: `/${string}`
  /**
   * The directory where the admin build is output. This is where the build process places the generated files.
   * The default value is `./build`.
   */
  outDir?: string
  /**
   * The URL of your Medusa backend. Defaults to an empty string, which means requests will hit the same server that serves the dashboard.
   */
  backendUrl?: string
  /**
   * Configure the Vite configuration for the admin dashboard. This function receives the default Vite configuration
   * and returns the modified configuration. The default value is `undefined`.
   *
   * @privateRemarks TODO Add example
   */
  vite?: (config: InlineConfig) => InlineConfig
}

/**
 * @interface
 *
 * Options to pass to `express-session`.
 */
type SessionOptions = {
  /**
   * The name of the session ID cookie to set in the response (and read from in the request). The default value is `connect.sid`.
   * Refer to [express-session’s documentation](https://www.npmjs.com/package/express-session#name) for more details.
   */
  name?: string
  /**
   * Whether the session should be saved back to the session store, even if the session was never modified during the request. The default value is `true`.
   * Refer to [express-session’s documentation](https://www.npmjs.com/package/express-session#resave) for more details.
   */
  resave?: boolean
  /**
   * Whether the session identifier cookie should be force-set on every response. The default value is `false`.
   * Refer to [express-session’s documentation](https://www.npmjs.com/package/express-session#rolling) for more details.
   */
  rolling?: boolean
  /**
   * Whether a session that is "uninitialized" is forced to be saved to the store. The default value is `true`.
   * Refer to [express-session’s documentation](https://www.npmjs.com/package/express-session#saveUninitialized) for more details.
   */
  saveUninitialized?: boolean
  /**
   * The secret to sign the session ID cookie. By default, the value of `http.cookieSecret` is used.
   * Refer to [express-session’s documentation](https://www.npmjs.com/package/express-session#secret) for details.
   */
  secret?: string
  /**
   * Used when calculating the `Expires` `Set-Cookie` attribute of cookies. By default, its value is `10 * 60 * 60 * 1000`.
   * Refer to [express-session’s documentation](https://www.npmjs.com/package/express-session#cookiemaxage) for details.
   */
  ttl?: number
}

/**
 * @interface
 *
 * HTTP compression configurations.
 */
export type HttpCompressionOptions = {
  /**
   * Whether HTTP compression is enabled. By default, it's `false`.
   */
  enabled?: boolean
  /**
   * The level of zlib compression to apply to responses. A higher level will result in better compression but will take longer to complete.
   * A lower level will result in less compression but will be much faster. The default value is `6`.
   */
  level?: number
  /**
   * How much memory should be allocated to the internal compression state. It's an integer in the range of 1 (minimum level) and 9 (maximum level).
   * The default value is `8`.
   */
  memLevel?: number
  /**
   * The minimum response body size that compression is applied on. Its value can be the number of bytes or any string accepted by the
   * [bytes](https://www.npmjs.com/package/bytes) module. The default value is `1024`.
   */
  threshold?: number | string
}

/**
 * @interface
 *
 * Essential configurations related to the Medusa backend, such as database and CORS configurations.
 */
export type ProjectConfigOptions = {
  /**
   * The name of the database to connect to. If specified in `databaseUrl`, then it’s not required to include it.
   *
   * Make sure to create the PostgreSQL database before using it. You can check how to create a database in
   * [PostgreSQL's documentation](https://www.postgresql.org/docs/current/sql-createdatabase.html).
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     databaseName: process.env.DATABASE_NAME ||
   *       "medusa-store",
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  databaseName?: string

  /**
   * The connection URL of the database. The format of the connection URL for PostgreSQL is:
   *
   * ```bash
   * postgres://[user][:password]@[host][:port]/[dbname]
   * ```
   *
   * Where:
   *
   * - `[user]`: (required) your PostgreSQL username. If not specified, the system's username is used by default. The database user that you use must have create privileges. If you're using the `postgres` superuser, then it should have these privileges by default. Otherwise, make sure to grant your user create privileges. You can learn how to do that in [PostgreSQL's documentation](https://www.postgresql.org/docs/current/ddl-priv.html).
   * - `[:password]`: an optional password for the user. When provided, make sure to put `:` before the password.
   * - `[host]`: (required) your PostgreSQL host. When run locally, it should be `localhost`.
   * - `[:port]`: an optional port that the PostgreSQL server is listening on. By default, it's `5432`. When provided, make sure to put `:` before the port.
   * - `[dbname]`: (required) the name of the database.
   *
   * You can learn more about the connection URL format in [PostgreSQL’s documentation](https://www.postgresql.org/docs/current/libpq-connect.html).
   *
   * @example
   * For example, set the following database URL in your environment variables:
   *
   * ```bash
   * DATABASE_URL=postgres://postgres@localhost/medusa-store
   * ```
   *
   * Then, use the value in `medusa-config.js`:
   *
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     databaseUrl: process.env.DATABASE_URL,
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  databaseUrl?: string

  /**
   * The database schema to connect to. This is not required to provide if you’re using the default schema, which is `public`.
   *
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     databaseSchema: process.env.DATABASE_SCHEMA ||
   *       "custom",
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  databaseSchema?: string

  /**
   * This configuration specifies what database messages to log. Its value can be one of the following:
   *
   * - (default) A boolean value that indicates whether any messages should be logged.
   * - The string value `all` that indicates all types of messages should be logged.
   * - An array of log-level strings to indicate which type of messages to show in the logs. The strings can be `query`, `schema`, `error`, `warn`, `info`, `log`, or `migration`. Refer to [Typeorm’s documentation](https://typeorm.io/logging#logging-options) for more details on what each of these values means.
   *
   * If this configuration isn't set, its default value is `false`, meaning no database messages are logged.
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     databaseLogging: ["query", "error"]
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  databaseLogging?: LoggerOptions

  /**
   * @ignore
   * @deprecated
   *
   * @privateRemarks
   * only postgres is supported, so this config has no effect
   */
  databaseType?: string

  /**
   * An object that includes additional configurations to pass to the database connection for v2. You can pass any configuration. One defined configuration to pass is
   * `ssl` which enables support for TLS/SSL connections.
   *
   * This is useful for production databases, which can be supported by setting the `rejectUnauthorized` attribute of `ssl` object to `false`.
   * During development, it’s recommended not to pass this option.
   * 
   * :::note
   * 
   * Make sure to add to the end of the database URL `?ssl_mode=disable` as well when disabling `rejectUnauthorized`.
   * 
   * :::
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     databaseDriverOptions: process.env.NODE_ENV !== "development" ?
   *       { ssl: { rejectUnauthorized: false } } : {}
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  databaseDriverOptions?: Record<string, unknown> & {
    connection?: {
      /**
       * Configure support for TLS/SSL connection
       */
      ssl?: {
        /**
         * Whether to fail connection if the server certificate is verified against the list of supplied CAs and the hostname and no match is found.
         */
        rejectUnauthorized?: false
      }
    }
  }

  /**
   * Used to specify the URL to connect to Redis. This is only used for scheduled jobs. If you omit this configuration, scheduled jobs won't work.
   *
   * :::note
   *
   * You must first have Redis installed. You can refer to [Redis's installation guide](https://redis.io/docs/getting-started/installation/).
   *
   * :::
   *
   * The Redis connection URL has the following format:
   *
   * ```bash
   * redis[s]://[[username][:password]@][host][:port][/db-number]
   * ```
   *
   * For a local Redis installation, the connection URL should be `redis://localhost:6379` unless you’ve made any changes to the Redis configuration during installation.
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     redisUrl: process.env.REDIS_URL ||
   *       "redis://localhost:6379",
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  redisUrl?: string

  /**
   * The prefix set on all keys stored in Redis. The default value is `sess:`.
   *
   * If this configuration option is provided, it is prepended to `sess:`.
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     redisPrefix: process.env.REDIS_URL || "medusa:",
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  redisPrefix?: string

  /**
   * An object of options to pass ioredis. You can refer to [ioredis’s RedisOptions documentation](https://redis.github.io/ioredis/index.html#RedisOptions)
   * for the list of available options.
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     redisOptions: {
   *       connectionName: process.env.REDIS_CONNECTION_NAME ||
   *         "medusa",
   *     }
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  redisOptions?: RedisOptions

  /**
   * An object of options to pass to [express-session](https://www.npmjs.com/package/express-session).
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     sessionOptions: {
   *       name: process.env.SESSION_NAME || "custom",
   *     }
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  sessionOptions?: SessionOptions

  /**
   * Configure HTTP compression from the application layer. If you have access to the HTTP server, the recommended approach would be to enable it there.
   * However, some platforms don't offer access to the HTTP layer and in those cases, this is a good alternative.
   *
   * If you enable HTTP compression and you want to disable it for specific API Routes, you can pass in the request header `"x-no-compression": true`.
   *
   * @ignore
   *
   * @deprecated use {@link http }'s `compression` property instead.
   *
   */
  httpCompression?: HttpCompressionOptions

  /**
   * Configure the number of staged jobs that are polled from the database. Default is `1000`.
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     jobsBatchSize: 100
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  jobsBatchSize?: number

  /**
   * Configure the application's worker mode.
   *
   * Workers are processes running separately from the main application. They're useful for executing long-running or resource-heavy tasks in the background, such as importing products.
   *
   * With a worker, these tasks are offloaded to a separate process. So, they won't affect the performance of the main application.
   *
   * ![Diagram showcasing how the server and worker work together](https://res.cloudinary.com/dza7lstvk/image/upload/fl_lossy/f_auto/r_16/ar_16:9,c_pad/v1/Medusa%20Book/medusa-worker_klkbch.jpg?_a=BATFJtAA0)
   *
   * Medusa has three runtime modes:
   *
   * - Use `shared` to run the application in a single process.
   * - Use `worker` to run the a worker process only.
   * - Use `server` to run the application server only.
   *
   * In production, it's recommended to deploy two instances:
   *
   * 1. One having the `workerMode` configuration set to `server`.
   * 2. Another having the `workerMode` configuration set to `worker`.
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     workerMode: process.env.WORKER_MODE || "shared"
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  workerMode?: "shared" | "worker" | "server"

  /**
   * Configure the application's http-specific settings
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     http: {
   *       cookieSecret: "supersecret",
   *       compression: {
   *         // ...
   *       }
   *     }
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  http: {
    /**
     * A random string used to create authentication tokens in the http layer. Although this configuration option is not required, it’s highly recommended to set it for better security.
     *
     * In a development environment, if this option is not set the default secret is `supersecret` However, in production, if this configuration is not set an error, an
     * error is thrown and the backend crashes.
     *
     * @example
     * ```js title="medusa-config.js"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       jwtSecret: "supersecret",
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     */
    jwtSecret?: string
    /**
     * The expiration time for the JWT token. If not provided, the default value is `24h`.
     *
     * @example
     * ```js title="medusa-config.js"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       jwtExpiresIn: "2d"
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     */
    jwtExpiresIn?: string
    /**
     * A random string used to create cookie tokens in the http layer. Although this configuration option is not required, it’s highly recommended to set it for better security.
     *
     * In a development environment, if this option is not set, the default secret is `supersecret` However, in production, if this configuration is not set, an error is thrown and
     * the backend crashes.
     *
     * @example
     * ```js title="medusa-config.js"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       cookieSecret: "supersecret"
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     */
    cookieSecret?: string
    /**
     * The Medusa backend’s API Routes are protected by Cross-Origin Resource Sharing (CORS). So, only allowed URLs or URLs matching a specified pattern can send requests to the backend’s API Routes.
     *
     * `cors` is a string used to specify the accepted URLs or patterns for API Routes starting with `/auth`. It can either be one accepted origin, or a comma-separated list of accepted origins.
     *
     * Every origin in that list must either be:
     *
     * 1. A URL. For example, `http://localhost:7001`. The URL must not end with a backslash;
     * 2. Or a regular expression pattern that can match more than one origin. For example, `.example.com`. The regex pattern that the backend tests for is `^([\/~@;%#'])(.*?)\1([gimsuy]*)$`.
     *
     * @example
     * Some example values of common use cases:
     *
     * ```bash
     * # Allow different ports locally starting with 700
     * AUTH_CORS=/http:\/\/localhost:700\d+$/
     *
     * # Allow any origin ending with vercel.app. For example, admin.vercel.app
     * AUTH_CORS=/vercel\.app$/
     *
     * # Allow all HTTP requests
     * AUTH_CORS=/http:\/\/.+/
     * ```
     *
     * Then, set the configuration in `medusa-config.js`:
     *
     * ```js title="medusa-config.js"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       authCors: process.env.AUTH_CORS
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     *
     * If you’re adding the value directly within `medusa-config.js`, make sure to add an extra escaping `/` for every backslash in the pattern. For example:
     *
     * ```js title="medusa-config.js"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       authCors: "/http:\\/\\/localhost:700\\d+$/",
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     */
    authCors: string
    /**
     *
     * Configure HTTP compression from the application layer. If you have access to the HTTP server, the recommended approach would be to enable it there.
     * However, some platforms don't offer access to the HTTP layer and in those cases, this is a good alternative.
     *
     * Its value is an object that has the following properties:
     *
     * If you enable HTTP compression and you want to disable it for specific API Routes, you can pass in the request header `"x-no-compression": true`.
     *
     * @example
     * ```js title="medusa-config.js"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       compression: {
     *         enabled: true,
     *         level: 6,
     *         memLevel: 8,
     *         threshold: 1024
     *       }
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     */
    compression?: HttpCompressionOptions
    /**
     * The Medusa backend’s API Routes are protected by Cross-Origin Resource Sharing (CORS). So, only allowed URLs or URLs matching a specified pattern can send requests to the backend’s API Routes.
     *
     * `store_cors` is a string used to specify the accepted URLs or patterns for store API Routes. It can either be one accepted origin, or a comma-separated list of accepted origins.
     *
     * Every origin in that list must either be:
     *
     * 1. A URL. For example, `http://localhost:8000`. The URL must not end with a backslash;
     * 2. Or a regular expression pattern that can match more than one origin. For example, `.example.com`. The regex pattern that the backend tests for is `^([\/~@;%#'])(.*?)\1([gimsuy]*)$`.
     *
     * @example
     * Some example values of common use cases:
     *
     * ```bash
     * # Allow different ports locally starting with 800
     * STORE_CORS=/http:\/\/localhost:800\d+$/
     *
     * # Allow any origin ending with vercel.app. For example, storefront.vercel.app
     * STORE_CORS=/vercel\.app$/
     *
     * # Allow all HTTP requests
     * STORE_CORS=/http:\/\/.+/
     * ```
     *
     * Then, set the configuration in `medusa-config.js`:
     *
     * ```js title="medusa-config.js"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       storeCors: process.env.STORE_CORS,
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     *
     * If you’re adding the value directly within `medusa-config.js`, make sure to add an extra escaping `/` for every backslash in the pattern. For example:
     *
     * ```js title="medusa-config.js"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       storeCors: "/vercel\\.app$/",
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     */
    storeCors: string

    /**
     * The Medusa backend’s API Routes are protected by Cross-Origin Resource Sharing (CORS). So, only allowed URLs or URLs matching a specified pattern can send requests to the backend’s API Routes.
     *
     * `admin_cors` is a string used to specify the accepted URLs or patterns for admin API Routes. It can either be one accepted origin, or a comma-separated list of accepted origins.
     *
     * Every origin in that list must either be:
     *
     * 1. A URL. For example, `http://localhost:7001`. The URL must not end with a backslash;
     * 2. Or a regular expression pattern that can match more than one origin. For example, `.example.com`. The regex pattern that the backend tests for is `^([\/~@;%#'])(.*?)\1([gimsuy]*)$`.
     *
     * @example
     * Some example values of common use cases:
     *
     * ```bash
     * # Allow different ports locally starting with 700
     * ADMIN_CORS=/http:\/\/localhost:700\d+$/
     *
     * # Allow any origin ending with vercel.app. For example, admin.vercel.app
     * ADMIN_CORS=/vercel\.app$/
     *
     * # Allow all HTTP requests
     * ADMIN_CORS=/http:\/\/.+/
     * ```
     *
     * Then, set the configuration in `medusa-config.js`:
     *
     * ```js title="medusa-config.js"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       adminCors: process.env.ADMIN_CORS,
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     *
     * If you’re adding the value directly within `medusa-config.js`, make sure to add an extra escaping `/` for every backslash in the pattern. For example:
     *
     * ```js title="medusa-config.js"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       adminCors: "/vercel\\.app$/",
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     */
    adminCors: string

    /**
     * Optionally you can specify the supported authentication providers per actor type (such as user, customer, or any custom actors).
     * For example, you only want to allow SSO logins for `users` to the admin, while you want to allow email/password logins for `customers` to the storefront.
     *
     * `authMethodsPerActor` is a a map where the actor type (eg. 'user') is the key, and an array of supported auth providers as the value.
     *
     *
     * @example
     * Some example values of common use cases:
     *
     * Then, set the configuration in `medusa-config.js`:
     *
     * ```js title="medusa-config.js"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       authMethodsPerActor: {
     *         user: ["email"],
     *         customer: ["emailpas", "google"]
     *       }
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     */
    authMethodsPerActor?: Record<string, string[]>
  }
}

/**
 * @interface
 *
 * The configurations for your Medusa backend are in `medusa-config.js` located in the root of your Medusa project. The configurations include database, modules, and plugin configurations, among other configurations.
 *
 * `medusa-config.js` exports an object having the following properties:
 *
 * - {@link ConfigModule.projectConfig | projectConfig} (required): An object that holds general configurations related to the Medusa backend, such as database or CORS configurations.
 * - {@link ConfigModule.admin | admin}: An object that holds admin-related configurations.
 * - {@link ConfigModule.plugins | plugins}: An array of plugin configurations that defines what plugins are installed and optionally specifies each of their configurations.
 * - {@link ConfigModule.modules | modules}: An object that defines what modules are installed and optionally specifies each of their configurations.
 * - {@link ConfigModule.featureFlags | featureFlags}: An object that enables or disables features guarded by a feature flag.
 *
 * For example:
 *
 * ```js title="medusa-config.js"
 * module.exports = defineConfig({
 *   projectConfig: {
 *     // ...
 *   },
 *   admin: {
 *     // ...
 *   },
 *   modules: {
 *     // ...
 *   },
 *   featureFlags: {
 *     // ...
 *   }
 * })
 * ```
 *
 * ---
 *
 * ## Environment Variables
 *
 * It's highly recommended to store the values of configurations in environment variables, then reference them within `medusa-config.js`.
 *
 * During development, you can set your environment variables in the `.env` file at the root of your Medusa backend project. In production,
 * setting the environment variables depends on the hosting provider.
 *
 * ---
 */
export type ConfigModule = {
  /**
   * This property holds essential configurations related to the Medusa backend, such as database and CORS configurations.
   */
  projectConfig: ProjectConfigOptions

  /**
   * Admin dashboard configurations.
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   admin: {
   *     backendUrl: process.env.MEDUSA_BACKEND_URL ||
   *       "http://localhost:9000"
   *   },
   *   // ...
   * })
   * ```
   */
  admin?: AdminOptions

  /**
   * On your Medusa backend, you can use [Plugins](https://docs.medusajs.com/development/plugins/overview) to add custom features or integrate third-party services.
   * For example, installing a plugin to use Stripe as a payment processor.
   *
   * Aside from installing the plugin with NPM, you need to pass the plugin you installed into the `plugins` array defined in `medusa-config.js`.
   *
   * The items in the array can either be:
   *
   * - A string, which is the name of the plugin to add. You can pass a plugin as a string if it doesn’t require any configurations.
   * - An object having the following properties:
   *     - `resolve`: The name of the plugin.
   *     - `options`: An object that includes the plugin’s options. These options vary for each plugin, and you should refer to the plugin’s documentation for available options.
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = {
   *   plugins: [
   *     `medusa-my-plugin-1`,
   *     {
   *       resolve: `medusa-my-plugin`,
   *       options: {
   *         apiKey: process.env.MY_API_KEY ||
   *           `test`,
   *       },
   *     },
   *     // ...
   *   ],
   *   // ...
   * }
   * ```
   *
   * @ignore
   *
   * @privateRemarks
   * Added the `@\ignore` tag for now so it's not generated in the main docs until we figure out what to do with plugins
   */
  plugins: (
    | {
        resolve: string
        options: Record<string, unknown>
      }
    | string
  )[]

  /**
   * In Medusa, commerce and core logic are modularized to allow developers to extend or replace certain [modules](https://docs.medusajs.com/development/modules/overview)
   * with custom implementations.
   *
   * Aside from installing the module with NPM, you must add it to the exported object in `medusa-config.js`.
   *
   * The keys of the `modules` configuration object refer to the module's registration name. Its value can be one of the following:
   *
   * 1. A boolean value indicating whether the module type is enabled. This is only supported for Medusa's commerce and architectural modules;
   * 2. Or an object having the following properties:
   *     1. `resolve`: a string indicating the path to the module relative to `src`, or the module's NPM package name.
   *     2. `options`: (optional) an object indicating the options to pass to the module.
   *     3. `definition`: (optional) an object of extra configurations, such as `isQueryable` used when a module has relationships.
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   modules: {
   *     helloModuleService: {
   *       resolve: "./modules/hello"
   *     }
   *   }
   *   // ...
   * })
   * ```
   */
  modules?: Record<
    string,
    boolean | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
  >

  /**
   * Some features in the Medusa backend are guarded by a feature flag. This ensures constant shipping of new features while maintaining the engine’s stability.
   *
   * You can specify whether a feature should or shouldn’t be used in your backend by enabling its feature flag. Feature flags can be enabled through either environment
   * variables or through this configuration exported in `medusa-config.js`.
   *
   * The `featureFlags` configuration is an object. Its properties are the names of the feature flags. Each property’s value is a boolean indicating whether the feature flag is enabled.
   *
   * You can find available feature flags and their key name [here](https://github.com/medusajs/medusa/tree/develop/packages/medusa/src/loaders/feature-flags).
   *
   * @example
   * ```js title="medusa-config.js"
   * module.exports = defineConfig({
   *   featureFlags: {
   *     product_categories: true,
   *     // ...
   *   }
   *   // ...
   * })
   * ```
   *
   * :::note
   *
   * After enabling a feature flag, make sure to run migrations as it may require making changes to the database.
   *
   * :::
   */
  featureFlags: Record<string, boolean | string | Record<string, boolean>>
}

export type PluginDetails = {
  resolve: string
  name: string
  id: string
  options: Record<string, unknown>
  version: string
}
