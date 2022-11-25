import { ConfigModule, Logger, MedusaContainer } from "@medusajs/medusa"
import { asValue } from "awilix"
import Redis from "ioredis"

type LoaderOptions = {
  container: MedusaContainer
  configModule: ConfigModule
  logger: Logger
}

export default async ({
  container,
  configModule,
  logger,
}: LoaderOptions): Promise<void> => {
  const redisUrl = configModule.projectConfig?.redis_url

  if (!redisUrl) {
    logger.warn(
      "No `redis_url` provided in project config. Redis event bus will not be available."
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
