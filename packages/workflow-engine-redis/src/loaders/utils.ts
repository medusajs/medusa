import { asClass } from "awilix"
import { RedisDistributedTransactionStorage } from "../utils"

export default async ({ container }): Promise<void> => {
  container.register({
    redisDistributedTransactionStorage: asClass(
      RedisDistributedTransactionStorage
    ).singleton(),
  })
}
