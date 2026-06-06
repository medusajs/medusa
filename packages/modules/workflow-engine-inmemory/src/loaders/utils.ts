import { asClass } from "@zjedene-medusa/framework/awilix"
import { InMemoryDistributedTransactionStorage } from "../utils"

export default async ({ container }): Promise<void> => {
  container.register({
    inMemoryDistributedTransactionStorage: asClass(
      InMemoryDistributedTransactionStorage
    ).singleton(),
  })
}
