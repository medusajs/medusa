import { Connection } from "typeorm"
import faker from "faker"
import { ShippingProfile, ShippingOption } from "@medusajs/medusa"

export type ShippingOptionFactoryData = {
  name?: string
  region_id: string
  price?: number
}

export const simpleShippingOptionFactory = async (
  connection: Connection,
  data: ShippingOptionFactoryData,
  seed?: number
): Promise<ShippingOption> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager
  const defaultProfile = await manager.findOne(ShippingProfile, {
    type: "default",
  })

  const gcProfile = await manager.findOne(ShippingProfile, {
    type: "gift_card",
  })

  const created = manager.create(ShippingOption, {
    id: `simple-so-${Math.random() * 1000}`,
    name: data.name || "Test Method",
    region_id: data.region_id,
    provider_id: "test-ful",
    profile_id: defaultProfile.id,
    price_type: "flat_rate",
    data: {},
    amount: typeof data.price !== "undefined" ? data.price : 500,
  })
  const option = await manager.save(created)
  return option
}
