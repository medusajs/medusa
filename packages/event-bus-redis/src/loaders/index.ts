import { ConfigModule, Logger, MedusaContainer } from "@medusajs/medusa"
import { asValue } from "awilix"
import RealRedis from "ioredis"

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
      redisClient: asValue(client),
      redisSubscriber: asValue(subscriber),
    })
  } else {
    logger.warn(
      "No `redis_url` provided in project config. Event bus will not be available."
    )
  }
}
