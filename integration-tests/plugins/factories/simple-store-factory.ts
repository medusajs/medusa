import { SalesChannel, Store } from "@medusajs/medusa"
import faker from "faker"
import { DataSource, Not, IsNull } from "typeorm"

export type StoreFactoryData = {
  swap_link_template?: string
}

export const simpleStoreFactory = async (
  dataSource: DataSource,
  data: StoreFactoryData = {},
  seed?: number
): Promise<Store | undefined> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager
  const stores = await manager.find(Store, { where: { id: Not(IsNull()) } })
  const store = stores[0]

  if (!store) {
    return
  }

  store.swap_link_template = data.swap_link_template ?? "something/{cart_id}"

  await manager.insert(SalesChannel, {
    id: "test-channel",
    name: "Default"
  })

  const storeToSave = await manager.save(store)

  await manager.query(`update store set default_sales_channel_id = 'test-channel' where id = '${storeToSave!.id}'`)

  return storeToSave!
}
