import { asValue } from "awilix"
import RealRedis from "ioredis"
import FakeRedis from "ioredis-mock"
import { ConfigModule, MedusaContainer } from "../types/global"
import { Logger } from "../types/global"

type Options = {
  container: MedusaContainer
  configModule: ConfigModule
  logger: Logger
}

async function redisLoader({
  container,
  configModule,
  logger,
}: Options): Promise<void> {
  if (configModule.projectConfig.redis_url) {
    // Economical way of dealing with redis clients
    const client = new RealRedis(configModule.projectConfig.redis_url)
    const subscriber = new RealRedis(configModule.projectConfig.redis_url)

    container.register({
      redisClient: asValue(client),
      redisSubscriber: asValue(subscriber),
    })
  } else {
    if (process.env.NODE_ENV === "production") {
      logger.warn(
        `No Redis url was provided - using Medusa in production without a proper Redis instance is not recommended`
      )
    }

    logger.info("Using fake Redis")

    // Economical way of dealing with redis clients
    const client = new FakeRedis()

    container.register({
      redisClient: asValue(client),
      redisSubscriber: asValue(client),
    })
  }
}

export default redisLoader
