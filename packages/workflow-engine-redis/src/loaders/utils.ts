import { asClass, asValue } from "awilix"
import { RedisDistributedTransactionStorage } from "../utils"

export default async ({ container, dataLoaderOnly }): Promise<void> => {
  container.register({
    redisDistributedTransactionStorage: asClass(
      RedisDistributedTransactionStorage
    ).singleton(),
    dataLoaderOnly: asValue(!!dataLoaderOnly),
  })
}
