import type {
  InternalModuleDeclaration,
  LoaderOptions,
  ModulesSdkTypes,
} from "@zjedene-medusa/framework/types"
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

  const { redisUrl, ...redisOptions_ } = moduleOptions
  if (!redisUrl) {
    throw new Error("[caching-redis] redisUrl is required")
  }

  let redisClient: Redis

  const redisOptions: RedisOptions = {
    connectTimeout: 10000,
    commandTimeout: 5000,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    enableOfflineQueue: true,
    connectionName: "medusa-cache-redis",
    ...redisOptions_,
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
