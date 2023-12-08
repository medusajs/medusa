import { ShippingProfile, ShippingProfileType } from "@medusajs/medusa"
import faker from "faker"
import { Connection } from "typeorm"

export type ShippingProfileFactoryData = {
  id?: string
  name?: string
  type?: ShippingProfileType
  metadata?: Record<string, unknown>
}

export const simpleShippingProfileFactory = async (
  connection: Connection,
  data: ShippingOptionFactoryData = {},
  seed?: number
): Promise<ShippingProfile> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

  const shippingProfileData = {
    id: data.id ?? `simple-sp-${Math.random() * 1000}`,
    name: data.name || `sp-${Math.random() * 1000}`,
    type: data.type || ShippingProfileType.DEFAULT,
    metadata: data.metadata,
    products: [],
    shipping_options: [],
  }

  const created = manager.create(ShippingProfile, shippingProfileData)

  return await manager.save(created)
}
