import { Connection } from "typeorm"
import faker from "faker"
import { Store } from "@medusajs/medusa"

export type StoreFactoryData = {
  swap_link_template?: string
}

export const simpleStoreFactory = async (
  connection: Connection,
  data: StoreFactoryData = {},
  seed?: number
): Promise<Store> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager
  const store = await manager.findOne(Store)

  store.swap_link_template = data.swap_link_template ?? "something/{cart_id}"

  return await manager.save(store)
}
