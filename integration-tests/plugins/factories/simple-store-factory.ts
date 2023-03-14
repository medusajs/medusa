import { SalesChannel, Store } from "@medusajs/medusa"
import faker from "faker"
import { Connection } from "typeorm"

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

  await manager.insert(SalesChannel, {
    id: "test-channel",
    name: "Default"
  })

  const storeToSave = await manager.save(store)

  await manager.query(`update store set default_sales_channel_id = 'test-channel' where id = '${storeToSave!.id}'`)

  return storeToSave!
}
