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

export type CartFactoryData = {}

export const simpleCartFactory = async (
  connection: Connection,
  data: CartFactoryData = {},
  seed: number
): Promise<Cart> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager
}
