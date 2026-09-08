import type {
  InternalModuleDeclaration,
  LoaderOptions,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { RedisCacheModuleOptions } from "@types"
import Redis, { type RedisOptions } from "ioredis"

export default async (
  {
    container,
    logger,
    options,
  }: LoaderOptions<
    (
      | ModulesSdkTypes.ModuleServiceInitializeOptions
      | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    ) & { logger?: any }
  >,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  const logger_ = logger || console

  const moduleOptions = (options ??
    moduleDeclaration?.options ??
    {}) as RedisCacheModuleOptions

  const {
    redisUrl,
    redisOptions: newRedisOptions,
    // Module options, not ioredis options. Pulled out so they are not
    // forwarded to the client along with the deprecated top-level options.
    ttl: _ttl,
    prefix: _prefix,
    compressionThreshold: _compressionThreshold,
    ...deprecatedRedisOptions
  } = moduleOptions
  if (!redisUrl) {
    throw new Error("[caching-redis] redisUrl is required")
  }

  // Handle backward compatibility for deprecated options
  if (!newRedisOptions && Object.keys(deprecatedRedisOptions).length) {
    logger_.warn(
      "[caching-redis] Passing ioredis options at the top level of the module options is deprecated. Please use `redisOptions` instead for consistency with other modules."
    )
  }

  let redisClient: Redis

  const redisOptions: RedisOptions = {
    connectTimeout: 10000,
    commandTimeout: 5000,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    enableOfflineQueue: true,
    connectionName: "medusa-cache-redis",
    ...(newRedisOptions ?? deprecatedRedisOptions),
  }

  redisClient = new Redis(redisUrl!, redisOptions)

  // Handle connection errors gracefully
  redisClient.on("error", (error) => {
    logger_.warn(`Redis cache connection error: ${error.message}`)
  })

  redisClient.on("connect", () => {
    logger_.info("Redis cache connection established successfully")
  })

  redisClient.on("ready", () => {
    logger_.info("Redis cache is ready to accept commands")
  })

  redisClient.on("close", () => {
    logger_.warn("Redis cache connection closed")
  })

  redisClient.on("reconnecting", () => {
    logger_.info("Redis cache attempting to reconnect...")
  })

  try {
    // Test connection with timeout
    await redisClient.ping()
    logger_.info("Redis cache connection test successful")
  } catch (error) {
    logger_.warn(
      `Redis cache connection test failed: ${error.message}, but continuing with lazy connection`
    )
  }

  container.register({
    redisClient: {
      resolve: () => redisClient,
    },
    prefix: {
      resolve: () => moduleOptions.prefix ?? "mc:",
    },
    logger: {
      resolve: () => logger_,
    },
  })
}
