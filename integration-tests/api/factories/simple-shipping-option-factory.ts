import { Connection } from "typeorm"
import faker from "faker"
import {
  ShippingOptionPriceType,
  ShippingProfile,
  ShippingOption,
  ShippingProfileType,
} from "@medusajs/medusa"

export type ShippingOptionFactoryData = {
  name?: string
  region_id: string
  is_return?: boolean
  is_giftcard?: boolean
  price?: number
  price_type?: ShippingOptionPriceType
  data?: object
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
    type: ShippingProfileType.DEFAULT,
  })

  const gcProfile = await manager.findOne(ShippingProfile, {
    type: ShippingProfileType.GIFT_CARD,
  })

  const created = manager.create(ShippingOption, {
    id: `simple-so-${Math.random() * 1000}`,
    name: data.name || "Test Method",
    is_return: data.is_return ?? false,
    region_id: data.region_id,
    provider_id: "test-ful",
    profile_id: data.is_giftcard ? gcProfile.id : defaultProfile.id,
    price_type: data.price_type ?? ShippingOptionPriceType.FLAT_RATE,
    data: data.data ?? {},
    amount: typeof data.price !== "undefined" ? data.price : 500,
  })
  const option = await manager.save(created)
  return option
}
