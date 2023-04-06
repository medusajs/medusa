import { Connection } from "typeorm"
import faker from "faker"
import { ShippingMethodTaxLine, ShippingMethod } from "@medusajs/medusa"

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
  tax_lines?: ShippingMethodTaxLine[]
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
    order_id: data.order_id,
    shipping_option_id: shippingOptionId,
    data: data.data || {},
    price: typeof data.price !== "undefined" ? data.price : 500,
  })

  const shippingMethod = await manager.save(toSave)

  if (typeof data.tax_lines !== "undefined") {
    const taxLinesToSave = data.tax_lines.map((tl) =>
      manager.create(ShippingMethodTaxLine, {
        shipping_method_id: shippingMethod.id,
        rate: tl.rate,
        code: tl.code || "default",
        name: tl.name || "default",
      })
    )

    await manager.save(taxLinesToSave)
  }

  return shippingMethod
}
