import { Modules } from "@medusajs/framework/utils"
import { ProviderLoaderOptions } from "@medusajs/types"
import { RedisCacheModuleOptions } from "@types"
import { asValue } from "awilix"
import Redis from "ioredis"

export default async ({
  container,
  logger,
  options,
  moduleOptions,
}: ProviderLoaderOptions): Promise<void> => {
  const { redisUrl, redisOptions, namespace } =
    options as RedisCacheModuleOptions

  if (!redisUrl) {
    throw Error(
      `No "redisUrl" provided in "${Modules.LOCKING}" module, "locking-redis" provider options. It is required for the "locking-redis" Module provider.`
    )
  }

  const connection = new Redis(redisUrl, {
    // Lazy connect to properly handle connection errors
    lazyConnect: true,
    ...(redisOptions ?? {}),
  })

  try {
    await connection.connect()
    logger?.info(`Connection to Redis in "locking-redis" provider established`)
  } catch (err) {
    logger?.error(
      `An error occurred while connecting to Redis in provider "locking-redis": ${err}`
    )
  }

  container.register({
    redisClient: asValue(connection),
    prefix: asValue(namespace ?? "medusa_lock:"),
  })
}
