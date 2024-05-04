import { LoaderOptions } from "@medusajs/modules-sdk"
import { asValue } from "awilix"
import Redis from "ioredis"
import { RedisCacheModuleOptions } from "../types"

export default async ({
  container,
  logger,
  options,
}: LoaderOptions): Promise<void> => {
  const { redisUrl, redisOptions } = options as RedisCacheModuleOptions

  if (!redisUrl) {
    throw Error(
      "No `redisUrl` provided in `cacheService` module options. It is required for the Redis Cache Module."
    )
  }

  const connection = new Redis(redisUrl, {
    // Lazy connect to properly handle connection errors
    lazyConnect: true,
    ...(redisOptions ?? {}),
  })

  try {
    await connection.connect()
    logger?.info(`Connection to Redis in module 'cache-redis' established`)
  } catch (err) {
    logger?.error(
      `An error occurred while connecting to Redis in module 'cache-redis': ${err}`
    )
  }

  container.register({
    cacheRedisConnection: asValue(connection),
  })
}
