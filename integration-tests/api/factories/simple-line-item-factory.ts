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

export type LineItemFactoryData = {}

export const simpleLineItemFactory = async (
  connection: Connection,
  data: LineItemFactoryData = {},
  seed?: number
): Promise<LineItem> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager
}
