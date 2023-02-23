import { LoaderOptions } from "@medusajs/medusa"
import { asValue } from "awilix"
import Redis from "ioredis"
import { EventBusRedisModuleOptions } from "../types"

export default async ({
  container,
  configModule,
  logger,
  options
}: LoaderOptions): Promise<void> => {
  const { redisUrl, redisOptions } = options as EventBusRedisModuleOptions

  if (!redisUrl) {
    throw Error(
      "No `redis_url` provided in project config. It is required for the Redis Event Bus."
    )
  }

  const connection = new Redis(redisUrl, {
    // Required config. See: https://github.com/OptimalBits/bull/blob/develop/CHANGELOG.md#breaking-changes
    maxRetriesPerRequest: null,
    // Lazy connect to properly handle connection errors
    lazyConnect: true,
    ...(redisOptions ?? {}),
  })

  try {
    await connection.connect()
    logger?.info(`Connection to Redis in module 'event-bus-redis' established`)
  } catch (err) {
    logger?.error(`An error occurred while connecting to Redis in module 'event-bus-redis': ${err}`)
  }

  container.register({
    redisConnection: asValue(connection),
  })
}
