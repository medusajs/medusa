import {
  ShippingOption,
  ShippingOptionPriceType,
  ShippingOptionRequirement,
  ShippingProfile,
  ShippingProfileType,
} from "@medusajs/medusa"
import faker from "faker"
import { DataSource } from "typeorm"
import { simpleRegionFactory } from "./simple-region-factory"

export type ShippingOptionFactoryData = {
  id?: string
  name?: string
  region_id?: string
  is_return?: boolean
  is_giftcard?: boolean
  price?: number
  price_type?: ShippingOptionPriceType
  includes_tax?: boolean
  data?: object
  requirements?: ShippingOptionRequirementData[]
}

type ShippingOptionRequirementData = {
  type: "min_subtotal" | "max_subtotal"
  amount: number
}

export const simpleShippingOptionFactory = async (
  dataSource: DataSource,
  data: ShippingOptionFactoryData = {},
  seed?: number
): Promise<ShippingOption> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager
  const defaultProfile = await manager.findOne(ShippingProfile, {
    where: {
      type: ShippingProfileType.DEFAULT,
    }
  })

  const gcProfile = await manager.findOne(ShippingProfile, {
    where: {
      type: ShippingProfileType.GIFT_CARD,
    }
  })

  let region_id = data.region_id

  if (!region_id) {
    const { id } = await simpleRegionFactory(dataSource)
    region_id = id
  }

  const shippingOptionData = {
    id: data.id ?? `simple-so-${Math.random() * 1000}`,
    name: data.name || "Test Method",
    is_return: data.is_return ?? false,
    region_id: region_id,
    provider_id: "test-ful",
    profile_id: data.is_giftcard ? gcProfile.id : defaultProfile.id,
    price_type: data.price_type ?? ShippingOptionPriceType.FLAT_RATE,
    data: data.data ?? {},
    requirements: (data.requirements || []) as ShippingOptionRequirement[],
    amount: typeof data.price !== "undefined" ? data.price : 500,
  }

  // This is purposefully managed out of the original object for the purpose of separating the data linked to a feature flag
  // MEDUSA_FF_TAX_INCLUSIVE_PRICING
  const { includes_tax } = data
  if (typeof includes_tax !== "undefined") {
    shippingOptionData["includes_tax"] = includes_tax
  }

  const created = manager.create(ShippingOption, shippingOptionData)
  return await manager.save(created)
}
