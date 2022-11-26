import { LoaderOptions } from "@medusajs/medusa"
import { asValue } from "awilix"
import Redis from "ioredis"

export default async ({
  container,
  configModule,
}: LoaderOptions): Promise<void> => {
  const redisUrl = configModule.projectConfig?.redis_url

  if (!redisUrl) {
    throw Error(
      "No `redis_url` provided in project config. It is required for Redis Event Bus."
    )
  }

  // Economical way of dealing with redis clients
  const client = new Redis(redisUrl)
  const subscriber = new Redis(redisUrl)

  container.register({
    eventBusRedisClient: asValue(client),
    eventBusRedisSubscriber: asValue(subscriber),
  })
}
