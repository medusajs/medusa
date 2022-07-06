import { Connection } from "typeorm"
import faker from "faker"
import { SalesChannel } from "@medusajs/medusa"

export type SalesChannelFactoryData = {
  name?: string
  description?: string
  is_disabled?: boolean
}

export const simpleSalesChannelFactory = async (
  connection: Connection,
  data: SalesChannelFactoryData = {},
  seed?: number
): Promise<SalesChannel> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

  const salesChannel = manager.create(SalesChannel, {
    id: `simple-id-${Math.random() * 1000}`,
    name: data.name || faker.name.firstName(),
    description: data.description || faker.name.lastName(),
    is_disabled:
      typeof data.is_disabled !== undefined ? data.is_disabled : false,
  })

  return await manager.save(salesChannel)
}