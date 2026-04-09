import type { Secret, SignOptions, VerifyOptions } from "jsonwebtoken"
import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
} from "../modules-sdk"

import type { RedisOptions } from "ioredis"

import { ConnectionOptions } from "node:tls"
// @ts-ignore
import type { InlineConfig } from "vite"
import type { Logger } from "../logger"

/**
 * Registry for module options types. Modules can augment this interface
 * using declaration merging to provide typed options in defineConfig.
 *
 * @example
 * ```ts
 * // In @medusajs/translation module:
 * declare module "@medusajs/types" {
 *   interface ModuleOptions {
 *     "@medusajs/translation": {
 *       entities?: { type: string; fields: string[] }[]
 *     }
 *   }
 * }
 * ```
 */
export interface ModuleOptions {}

/**
 * @interface
 *
 * Admin dashboard configurations.
 */
export interface AdminOptions {
  /**
   * Whether to disable the admin dashboard. If set to `true`, the admin dashboard is disabled,
   * in both development and production environments. The default value is `false`.
   *
   * @example
   * ```js title="medusa-config.ts"
   * module.exports = defineConfig({
   *   admin: {
   *     disable: process.env.ADMIN_DISABLED === "true" ||
   *       false
   *   },
   *   // ...
   * })
   * ```
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
   *
   * @example
   * ```ts title="medusa-config.ts"
   * module.exports = defineConfig({
   *   admin: {
   *     path: process.env.ADMIN_PATH || `/app`,
   *   },
   *   // ...
   * })
   * ```
   */
  path: `/${string}`

  /**
   * The URL of your Medusa application. Defaults to the browser origin. This is useful to set when running the admin on a separate domain.
   *
   * @example
   * ```js title="medusa-config.ts"
   * module.exports = defineConfig({
   *   admin: {
   *     backendUrl: process.env.MEDUSA_BACKEND_URL ||
   *       "http://localhost:9000"
   *   },
   *   // ...
   * })
   * ```
   */
  backendUrl?: string

  /**
   * The URL of your Medusa storefront application. This will help generate links from the admin
   * to provide to customers to complete any processes
   *
   * @example
   * ```js title="medusa-config.ts"
   * module.exports = defineConfig({
   *   admin: {
   *     storefrontUrl: process.env.MEDUSA_STOREFRONT_URL ||
   *       "http://localhost:9000"
   *   },
   *   // ...
   * })
   * ```
   */
  storefrontUrl?: string

  /**
   * The directory where the admin build is output. This is where the build process places the generated files.
   * The default value is `./build`.
   */
  outDir?: string

  /**
   * Configure the Vite configuration for the admin dashboard. This function receives the default Vite configuration
   * and returns the modified configuration. The default value is `undefined`.
   *
   * @privateRemarks TODO Add example
   */
  vite?: (config: InlineConfig) => InlineConfig

  /**
   * The maximum file size for media uploads in bytes. The default value is `1048576` (1MB).
   * Set to `Infinity` to disable the file size limit.
   *
   * @example
   * ```js title="medusa-config.ts"
   * module.exports = defineConfig({
   *   admin: {
   *     maxUploadFileSize: 10 * 1024 * 1024, // 10MB
   *   },
   *   // ...
   * })
   * ```
   */
  maxUploadFileSize?: number
}

/**
 * @interface
 *
 * Options to pass to `express-session`.
 */
export type SessionOptions = {
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

  /**
   * Specify the options for storing session data to dynamoDB. Make
   * sure to install the following dependencies first.
   *
   * - @aws-sdk/client-dynamodb@^3.218.0
   * - connect-dynamodb@^3.0.5
   */
  dynamodbOptions?: {
    clientOptions?: {
      endpoint?: string
    }
    table?: string
    /** Defaults to 'sess:' */
    prefix?: string
    /** Defaults to 'id' */
    hashKey?: string
    readCapacityUnits?: number
    writeCapacityUnits?: number
    specialKeys?: {
      name: string
      type: string
    }[]
    skipThrowMissingSpecialKeys?: boolean
    /**
     * Disable initialization.
     * Useful if the table already exists or if you want to skip existence checks in a serverless environment such as AWS Lambda.
     */
    initialized?: boolean
  }
}

/**
 * @interface
 *
 * Options to pass to `express-session`.
 */
export type CookieOptions = Record<string, any> & {
  secure?: boolean
  sameSite?: "lax" | "strict" | "none"
  maxAge?: number
  httpOnly?: boolean
  priority?: "low" | "medium" | "high"
  domain?: string
  path?: string
  signed?: boolean
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
 * Medusa Cloud configurations.
 */
export type MedusaCloudOptions = {
  /**
   * The environment handle of the Medusa Cloud environment.
   */
  environmentHandle?: string
  /**
   * The sandbox handle of the Medusa Cloud sandbox.
   */
  sandboxHandle?: string
  /**
   * The API key used to access Medusa Cloud services.
   */
  apiKey?: string
  /**
   * The webhook secret used to verify webhooks.
   */
  webhookSecret?: string
  /**
   * The endpoint of the Medusa Cloud payment service.
   */
  paymentsEndpoint?: string
  /**
   * The endpoint of the Medusa Cloud email service.
   */
  emailsEndpoint?: string
  /**
   * The authorization endpoint of the Medusa Cloud OAuth service.
   */
  oauthAuthorizeEndpoint?: string
  /**
   * The token endpoint of the Medusa Cloud OAuth token service.
   */
  oauthTokenEndpoint?: string
  /**
   * The callback URL for the Medusa Cloud OAuth service. If not provided, it will be set to `${AdminOptions.backendUrl}/auth/user/cloud/callback`.
   */
  oauthCallbackUrl?: string
  /**
   * Whether the Medusa Cloud OAuth service is disabled.
   */
  oauthDisabled?: boolean
}

/**
 * @interface
 *
 * Essential configurations related to the Medusa application, such as database and CORS configurations.
 */
export type ProjectConfigOptions = {
  /**
   * The name of the database to connect to. If the name is specified in `databaseUrl`, then you don't have to use this configuration.
   *
   * Make sure to create the PostgreSQL database before using it. You can check how to create a database in
   * [PostgreSQL's documentation](https://www.postgresql.org/docs/current/sql-createdatabase.html).
   *
   * @example
   * ```js title="medusa-config.ts"
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
   * The PostgreSQL connection URL of the database, which is of the following format:
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
   * Then, use the value in `medusa-config.ts`:
   *
   * ```js title="medusa-config.ts"
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
   * ```js title="medusa-config.ts"
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
   * This configuration specifies whether database messages should be logged.
   *
   * @example
   * ```js title="medusa-config.ts"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     databaseLogging: false
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   */
  databaseLogging?: boolean

  /**
   * This configuration is used to pass additional options to the database connection. You can pass any configuration. For example, pass the
   * `ssl` property that enables support for TLS/SSL connections.
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
   * ```js title="medusa-config.ts"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     databaseDriverOptions: process.env.NODE_ENV !== "development" ?
   *       { connection: { ssl: { rejectUnauthorized: false } } } : {}
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
      ssl?: boolean | ConnectionOptions
    }
  }

  /**
   * This configuration specifies the connection URL to Redis to store the Medusa server's session.
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
   * ```js title="medusa-config.ts"
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
   * This configuration defines a prefix on all keys stored in Redis for the Medusa server's session. The default value is `sess:`.
   *
   * If this configuration option is provided, it is prepended to `sess:`.
   *
   * @example
   * ```js title="medusa-config.ts"
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
   * This configuration defines options to pass ioredis for the Redis connection used to store the Medusa server's session. Refer to [ioredis’s RedisOptions documentation](https://redis.github.io/ioredis/index.html#RedisOptions)
   * for the list of available options.
   *
   * @example
   * ```js title="medusa-config.ts"
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
   * This configuration defines additional options to pass to [express-session](https://www.npmjs.com/package/express-session), which is used to store the Medusa server's session.
   *
   * @example
   * ```js title="medusa-config.ts"
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

  cookieOptions?: CookieOptions

  /**
   * Configure the number of staged jobs that are polled from the database. Default is `1000`.
   *
   * @example
   * ```js title="medusa-config.ts"
   * module.exports = defineConfig({
   *   projectConfig: {
   *     jobsBatchSize: 100
   *     // ...
   *   },
   *   // ...
   * })
   * ```
   *
   * @ignore
   *
   * @privateRemarks
   * Couldn't find any use for this option.
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
   * ```js title="medusa-config.ts"
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
   * This property configures the application's http-specific settings.
   *
   * @example
   * ```js title="medusa-config.ts"
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
     * In a development environment, if this option is not set the default secret is `supersecret`. However, in production, if this configuration is not set, an
     * error is thrown and the application crashes.
     *
     * @example
     * ```js title="medusa-config.ts"
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
    jwtSecret?: Secret

    /**
     * The public key used to verify the JWT token in combination with the JWT secret and the JWT options.
     * Only used when the JWT secret is a secret key for asymetric validation.
     *
     * @example
     * ```js title="medusa-config.ts"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       jwtPublicKey: "public-key"
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     */
    jwtPublicKey?: Secret

    /**
     * Options for the JWT token when using asymetric signing private/public key. Will be used for validation if `jwtVerifyOptions` is not provided.
     *
     * @example
     * ```js title="medusa-config.ts"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       jwtOptions: {
     *         algorithm: "RS256",
     *         expiresIn: "1h",
     *         issuer: "medusa",
     *         keyid: "medusa",
     *       }
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     */
    jwtOptions?: SignOptions

    /**
     * Options for the JWT token when using asymetric validation private/public key.
     *
     * @example
     * ```js title="medusa-config.ts"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       jwtVerifyOptions: {
     *         // ...
     *       }
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     */
    jwtVerifyOptions?: VerifyOptions

    /**
     * The expiration time for the JWT token. Its format is based off the [ms package](https://github.com/vercel/ms).
     *
     * If not provided, the default value is `24h`.
     *
     * @example
     * ```js title="medusa-config.ts"
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
     * In a development environment, if this option is not set, the default secret is `supersecret`. However, in production, if this configuration is not set, an error is thrown and
     * the application crashes.
     *
     * @example
     * ```js title="medusa-config.ts"
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
     * The Medusa application's API Routes are protected by Cross-Origin Resource Sharing (CORS). So, only allowed URLs or URLs matching a specified pattern can send requests to the backend’s API Routes.
     *
     * `cors` is a string used to specify the accepted URLs or patterns for API Routes starting with `/auth`. It can either be one accepted origin, or a comma-separated list of accepted origins.
     *
     * Every origin in that list must either be:
     *
     * 1. A URL. For example, `http://localhost:7001`. The URL must not end with a backslash;
     * 2. Or a regular expression pattern that can match more than one origin. For example, `.example.com`. The regex pattern that Medusa tests for is `^([\/~@;%#'])(.*?)\1([gimsuy]*)$`.
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
     * Then, set the configuration in `medusa-config.ts`:
     *
     * ```js title="medusa-config.ts"
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
     * If you’re adding the value directly within `medusa-config.ts`, make sure to add an extra escaping `/` for every backslash in the pattern. For example:
     *
     * ```js title="medusa-config.ts"
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
     * If you enable HTTP compression and you want to disable it for specific API Routes, you can pass in the request header `"x-no-compression": true`.
     * Learn more in the [API Reference](https://docs.medusajs.com/api/store#http-compression).
     *
     * @example
     * ```js title="medusa-config.ts"
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
     * The Medusa application's API Routes are protected by Cross-Origin Resource Sharing (CORS). So, only allowed URLs or URLs matching a specified pattern can send requests to the backend’s API Routes.
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
     * Then, set the configuration in `medusa-config.ts`:
     *
     * ```js title="medusa-config.ts"
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
     * If you’re adding the value directly within `medusa-config.ts`, make sure to add an extra escaping `/` for every backslash in the pattern. For example:
     *
     * ```js title="medusa-config.ts"
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
     * The Medusa application's API Routes are protected by Cross-Origin Resource Sharing (CORS). So, only allowed URLs or URLs matching a specified pattern can send requests to the backend’s API Routes.
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
     * Then, set the configuration in `medusa-config.ts`:
     *
     * ```js title="medusa-config.ts"
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
     * If you’re adding the value directly within `medusa-config.ts`, make sure to add an extra escaping `/` for every backslash in the pattern. For example:
     *
     * ```js title="medusa-config.ts"
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
     * This configuration specifies the supported authentication providers per actor type (such as `user`, `customer`, or any custom actors).
     * For example, you only want to allow SSO logins for `users`, while you want to allow email/password logins for `customers` to the storefront.
     *
     * `authMethodsPerActor` is a map where the actor type (eg. 'user') is the key, and the value is an array of supported auth provider IDs.
     *
     * @example
     * Some example values of common use cases:
     *
     * Then, set the configuration in `medusa-config.ts`:
     *
     * ```js title="medusa-config.ts"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       authMethodsPerActor: {
     *         user: ["email"],
     *         customer: ["emailpass", "google"]
     *       }
     *     }
     *     // ...
     *   },
     *   // ...
     * })
     * ```
     */
    authMethodsPerActor?: Record<string, string[]>

    /**
     * Specifies the fields that can't be selected in the response unless specified in the allowed query config.
     * This is useful to restrict sensitive fields from being exposed in the API.
     *
     * @example
     *
     * ```js title="medusa-config.ts"
     * module.exports = defineConfig({
     *   projectConfig: {
     *     http: {
     *       restrictedFields: {
     *         store: ["order", "orders"],
     *       }
     *     }
     * ```
     */
    restrictedFields?: {
      store?: string[]
      /*admin?: string[]*/
    }
  }

  /**
   * This property holds configurations for running in Medusa Cloud.
   * It gets automatically populated in the cloud, and is not needed outside of it.
   */
  cloud?: MedusaCloudOptions
}

/**
 * @interface
 *
 * The configurations for your Medusa application are set in `medusa-config.ts` located in the root of your Medusa project. The configurations include configurations for database, modules, and more.
 *
 * :::note
 *
 * Some Medusa configurations are set through environment variables, which you can find in [this documentation](https://docs.medusajs.com/learn/fundamentals/environment-variables#predefined-medusa-environment-variables).
 *
 * :::
 *
 * `medusa-config.ts` exports the value returned by the `defineConfig` utility function imported from `@medusajs/framework/utils`.
 *
 * `defineConfig` accepts as a parameter an object with the following properties:
 *
 * - {@link ConfigModule.projectConfig | projectConfig} (required): An object that holds general configurations related to the Medusa application, such as database or CORS configurations.
 * - {@link ConfigModule.plugins | plugins}: An array of strings or objects that hold the configurations of the plugins installed in the Medusa application.
 * - {@link ConfigModule.admin | admin}: An object that holds admin-related configurations.
 * - {@link ConfigModule.modules | modules}: An object that configures the Medusa application's modules.
 * - {@link ConfigModule.featureFlags | featureFlags}: An object that enables or disables features guarded by a feature flag.
 *
 * For example:
 *
 * ```ts title="medusa-config.ts"
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
 * It's highly recommended to store the values of configurations in environment variables, then reference them within `medusa-config.ts`.
 *
 * During development, you can set your environment variables in the `.env` file at the root of your Medusa application project. In production,
 * setting the environment variables depends on the hosting provider.
 *
 * ---
 */
export type ConfigModule = {
  /**
   * This property holds essential configurations related to the Medusa application, such as database, CORS configurations and Logger.
   */
  projectConfig: ProjectConfigOptions

  /**
   * This property holds configurations for the Medusa Admin dashboard.
   *
   * @example
   * ```ts title="medusa-config.ts"
   * module.exports = defineConfig({
   *   admin: {
   *     backendUrl: process.env.MEDUSA_BACKEND_URL ||
   *       "http://localhost:9000"
   *   },
   *   // ...
   * })
   * ```
   */
  admin: AdminOptions

  /**
   * On your Medusa server, you can use [Plugins](https://docs.medusajs.com/learn/fundamentals/plugins) to add re-usable Medusa customizations. Plugins
   * can include modules, workflows, API Routes, and other customizations. Plugins are available starting from [Medusa v2.3.0](https://github.com/medusajs/medusa/releases/tag/v2.3.0).
   *
   * Aside from installing the plugin with NPM, you need to pass the plugin you installed into the `plugins` array defined in `medusa-config.ts`.
   *
   * The items in the array can either be:
   *
   * - A string, which is the name of the plugin's package as specified in the plugin's `package.json` file. You can pass a plugin as a string if it doesn’t require any options.
   * - An object having the following properties:
   *     - `resolve`: The name of the plugin's package as specified in the plugin's `package.json` file.
   *     - `options`: An object that includes options to be passed to the modules within the plugin. Learn more in [this documentation](https://docs.medusajs.com/learn/fundamentals/modules/options).
   *
   * Learn how to create a plugin in [this documentation](https://docs.medusajs.com/learn/fundamentals/plugins/create).
   *
   * @example
   * ```ts title="medusa-config.ts"
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
   */
  plugins: (
    | {
        /**
         * The name of the plugin's package as specified in the plugin's `package.json` file.
         */
        resolve: string
        /**
         * An object that includes options to be passed to the modules within the plugin.
         * Learn more in [this documentation](https://docs.medusajs.com/learn/fundamentals/modules/options).
         */
        options: Record<string, unknown>
      }
    | string
  )[]

  /**
   * This property holds all custom modules installed in your Medusa application.
   *
   * :::note
   *
   * Medusa's Commerce Modules are configured by default, so only
   * add them to this property if you're changing their configurations or adding providers to a module.
   *
   * :::
   *
   * `modules` is an array of objects, each holding a module's registration configurations. Each object has the following properties:
   *
   * 1. `resolve`: a string indicating the path to the module relative to `src`, or the module's NPM package name. For example, `./modules/my-module`.
   * 2. `options`: (optional) an object indicating the options to pass to the module.
   *
   * @example
   * ```ts title="medusa-config.ts"
   * module.exports = defineConfig({
   *   modules: [
   *     {
   *       resolve: "./modules/hello"
   *     }
   *   ]
   *   // ...
   * })
   * ```
   */
  modules?: Record<
    string,
    boolean | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
  >

  /**
   * Some features in the Medusa application are guarded by a feature flag. This ensures constant shipping of new features while maintaining the engine’s stability.
   *
   * You can enable a feature in your application by enabling its feature flag. Feature flags are enabled through either environment
   * variables or through this configuration property exported in `medusa-config.ts`.
   *
   * The `featureFlags`'s value is an object. Its properties are the names of the feature flags, and their value is a boolean indicating whether the feature flag is enabled.
   *
   * You can find available feature flags and their key name [here](https://github.com/medusajs/medusa/tree/develop/packages/medusa/src/feature-flags).
   *
   * @example
   * ```ts title="medusa-config.ts"
   * module.exports = defineConfig({
   *   featureFlags: {
   *     analytics: true,
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

  /**
   * The Logger instance to be used by the application.
   */
  logger?: Logger
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

type ModuleConfigForResolve<R extends string> = R extends keyof ModuleOptions
  ? {
      resolve: R
      key?: string
      disable?: boolean
      options?: ModuleOptions[R]
    } & Partial<Omit<InternalModuleDeclaration, "options" | "resolve">>
  : {
      resolve?: string
      key?: string
      disable?: boolean
      options?: object
    } & Partial<Omit<InternalModuleDeclaration, "options" | "resolve">>

/**
 * Generates a union of typed module configs for all known modules in the ModuleOptions registry.
 * This distributes over all keys in ModuleOptions to create specific config types for each.
 */
type KnownModuleConfigs = ModuleConfigForResolve<keyof ModuleOptions & string>

/**
 * Generic module config for modules not registered in ModuleOptions.
 */
type GenericModuleConfig = ModuleConfigForResolve<string & {}>

/**
 * Modules accepted by the defineConfig function.
 * Automatically infers options type for known modules registered in ModuleOptions.
 */
export type InputConfigModules = (
  | KnownModuleConfigs
  | GenericModuleConfig
  | ExternalModuleDeclarationOverride
)[]

/**
 * Base configuration type without modules
 */
type InputConfigBase = Partial<
  Omit<ConfigModule, "admin" | "modules"> & {
    admin?: Partial<ConfigModule["admin"]>
  }
>

/**
 * Configuration with array-based modules (recommended)
 */
export type InputConfigWithArrayModules = InputConfigBase & {
  modules?: InputConfigModules
}

/**
 * Configuration with object-based modules (deprecated)
 * @deprecated Use array-based modules instead
 */
export type InputConfigWithObjectModules = InputConfigBase & {
  modules?: ConfigModule["modules"]
}

/**
 * The configuration accepted by the "defineConfig" helper
 */
export type InputConfig =
  | InputConfigWithArrayModules
  | InputConfigWithObjectModules

type PluginAdminDetails = {
  type: "local" | "package"
  resolve: string
}

export type PluginDetails = {
  resolve: string
  name: string
  id: string
  options: Record<string, unknown>
  version: string
  admin?: PluginAdminDetails
  modules?: InputConfigModules
}
