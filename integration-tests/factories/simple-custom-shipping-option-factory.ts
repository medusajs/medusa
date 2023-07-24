import { DataSource } from "typeorm"
import faker from "faker"
import { CustomShippingOption } from "@medusajs/medusa"

export type CustomShippingOptionFactoryData = {
  id?: string
  cart_id: string
  shipping_option_id: string
  price?: number
  metadata?: Record<string, unknown>
}

export const simpleCustomShippingOptionFactory = async (
  dataSource: DataSource,
  data: CustomShippingOptionFactoryData,
  seed?: number
): Promise<CustomShippingOption> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  const customShippingOptionData = {
    id: data.id ?? `custon-simple-so-${Math.random() * 1000}`,
    price: typeof data.price !== "undefined" ? data.price : 500,
    cart_id: data.cart_id,
    shipping_option_id: data.shipping_option_id,
    metadata: data.metadata ?? {},
  }

  const created = manager.create(CustomShippingOption, customShippingOptionData)
  return await manager.save(created)
}
