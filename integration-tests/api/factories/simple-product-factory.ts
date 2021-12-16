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
  ProductVariant,
  MoneyAmount,
  LineItem,
  Payment,
  PaymentSession,
} from "@medusajs/medusa"

export type ProductFactoryData = {
  id?: string
  is_giftcard?: boolean
}

export const simpleLineItemFactory = async (
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

  const toSave = manager.create(Product, {
    id: "giftcard-product",
    title: "Giftcard",
    is_giftcard: true,
    discountable: false,
    profile_id: data.is_giftcard ? gcProfile.id : defaultProfile.id,
    options: [{ id: "denom", title: "Denomination" }],
  })

  const product = await manager.save(toSave)

  return product
}
