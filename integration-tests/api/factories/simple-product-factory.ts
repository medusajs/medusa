import { Connection } from "typeorm"
import faker from "faker"
import {
  Customer,
  Region,
  Cart,
  DiscountRule,
  Discount,
  ShippingProfile,
  ShippingOption,
  ShippingMethod,
  Address,
  Product,
  ProductOption,
  ProductVariant,
  MoneyAmount,
  LineItem,
  Payment,
  PaymentSession,
} from "@medusajs/medusa"

import {
  simpleProductVariantFactory,
  ProductVariantFactoryData,
} from "./simple-product-variant-factory"

export type ProductFactoryData = {
  id?: string
  is_giftcard?: boolean
  title?: string
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
    type: "default",
  })

  const gcProfile = await manager.findOne(ShippingProfile, {
    type: "gift_card",
  })

  const prodId = data.id || `simple-product-${Math.random() * 1000}`
  const toSave = manager.create(Product, {
    id: prodId,
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
      id: "simple-test-variant",
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
