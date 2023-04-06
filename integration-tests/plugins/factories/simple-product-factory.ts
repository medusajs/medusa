import { Connection } from "typeorm"
import faker from "faker"
import { Product, ProductOption, ProductType, ShippingProfile, ShippingProfileType, } from "@medusajs/medusa"

import { ProductVariantFactoryData, simpleProductVariantFactory, } from "./simple-product-variant-factory"

export type ProductFactoryData = {
  id?: string
  is_giftcard?: boolean
  title?: string
  type?: string
  options?: { id: string; title: string }[]
  variants?: ProductVariantFactoryData[]
}

export const simpleProductFactory = async (
  connection: Connection,
  data: ProductFactoryData = {},
  seed?: number
): Promise<Product> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

  const defaultProfile = await manager.findOne(ShippingProfile, {
    where: { type: ShippingProfileType.DEFAULT },
  })

  const gcProfile = await manager.findOne(ShippingProfile, {
    where: { type: ShippingProfileType.GIFT_CARD },
  })

  let typeId: string
  if (typeof data.type !== "undefined") {
    const toSave = manager.create(ProductType, {
      value: data.type,
    })
    const res = await manager.save(toSave)
    typeId = res.id
  }

  const prodId = data.id || `simple-product-${Math.random() * 1000}`
  const toSave = manager.create(Product, {
    id: prodId,
    type_id: typeId,
    title: data.title || faker.commerce.productName(),
    is_giftcard: data.is_giftcard || false,
    discountable: !data.is_giftcard,
    profile_id: data.is_giftcard ? gcProfile.id : defaultProfile.id,
  })

  const product = await manager.save(toSave)

  const optionId = `${prodId}-option`
  const options = data.options || [{ id: optionId, title: "Size" }]
  for (const o of options) {
    await manager.insert(ProductOption, {
      id: o.id,
      title: o.title,
      product_id: prodId,
    })
  }

  const variants = data.variants || [
    {
      id: `simple-test-variant-${Math.random() * 1000}`,
      title: "Test",
      product_id: prodId,
      prices: [{ currency: "usd", amount: 100 }],
      options: [{ option_id: optionId, value: "Large" }],
    },
  ]

  for (const pv of variants) {
    const factoryData = {
      ...pv,
      product_id: prodId,
    }
    if (typeof pv.options === "undefined") {
      factoryData.options = [
        { option_id: optionId, value: faker.commerce.productAdjective() },
      ]
    }
    await simpleProductVariantFactory(connection, factoryData)
  }

  return product
}
