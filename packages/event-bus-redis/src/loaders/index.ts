import { ConfigModule, Logger, MedusaContainer } from "@medusajs/medusa"
import { asValue } from "awilix"
import RealRedis from "ioredis"
import FakeRedis from "ioredis-mock"

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
  if (configModule.projectConfig.redis_url) {
    // Economical way of dealing with redis clients
    const client = new RealRedis(configModule.projectConfig.redis_url)
    const subscriber = new RealRedis(configModule.projectConfig.redis_url)

    container.register({
      eventBusRedisClient: asValue(client),
      eventBusRedisSubscriber: asValue(subscriber),
    })
  } else {
    logger.warn(
      "No `redis_url` provided in project config. Redis event bus will not be available."
    )

    logger.info("Using fake Redis for event bus")

    // Economical way of dealing with redis clients
    const client = new FakeRedis()

    container.register({
      eventBusRedisClient: asValue(client),
      eventBusRedisSubscriber: asValue(client),
    })
  }
}
