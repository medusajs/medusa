import { Connection } from "typeorm"
import faker from "faker"
import { ShippingMethod } from "@medusajs/medusa"

import {
  ShippingOptionFactoryData,
  simpleShippingOptionFactory,
} from "./simple-shipping-option-factory"

export type ShippingMethodFactoryData = {
  id?: string
  cart_id?: string
  order_id?: string
  data?: object
  price?: number
  shipping_option: string | ShippingOptionFactoryData
}

export const simpleShippingMethodFactory = async (
  connection: Connection,
  data: ShippingMethodFactoryData,
  seed?: number
): Promise<ShippingMethod> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

  let shippingOptionId: string
  if (typeof data.shipping_option === "string") {
    shippingOptionId = data.shipping_option
  } else {
    const option = await simpleShippingOptionFactory(
      connection,
      data.shipping_option
    )
    shippingOptionId = option.id
  }

  const id = data.id || `simple-sm-${Math.random() * 1000}`
  const toSave = manager.create(ShippingMethod, {
    id,
    cart_id: data.cart_id,
    shipping_option_id: shippingOptionId,
    data: data.data || {},
    price: typeof data.price !== "undefined" ? data.price : 500,
  })

  const shippingMethod = await manager.save(toSave)
  return shippingMethod
}
