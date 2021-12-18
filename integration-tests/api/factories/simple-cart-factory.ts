import { Connection } from "typeorm"
import faker from "faker"
import { Cart } from "@medusajs/medusa"

import { RegionFactoryData, simpleRegionFactory } from "./simple-region-factory"
import {
  LineItemFactoryData,
  simpleLineItemFactory,
} from "./simple-line-item-factory"
import {
  AddressFactoryData,
  simpleAddressFactory,
} from "./simple-address-factory"
import {
  ShippingMethodFactoryData,
  simpleShippingMethodFactory,
} from "./simple-shipping-method-factory"

export type CartFactoryData = {
  id?: string
  region?: RegionFactoryData | string
  email?: string | null
  line_items?: LineItemFactoryData[]
  shipping_address?: AddressFactoryData
  shipping_methods?: ShippingMethodFactoryData[]
}

export const simpleCartFactory = async (
  connection: Connection,
  data: CartFactoryData = {},
  seed: number
): Promise<Cart> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

  let regionId: string
  if (typeof data.region === "string") {
    regionId = data.region
  } else {
    const region = await simpleRegionFactory(connection, data.region)
    regionId = region.id
  }
  const address = await simpleAddressFactory(connection, data.shipping_address)

  const id = data.id || `simple-cart-${Math.random() * 1000}`
  const toSave = manager.create(Cart, {
    id,
    email:
      typeof data.email !== "undefined" ? data.email : faker.internet.email(),
    region_id: regionId,
    shipping_address_id: address.id,
  })

  const cart = await manager.save(toSave)

  const shippingMethods = data.shipping_methods || []
  for (const sm of shippingMethods) {
    await simpleShippingMethodFactory(connection, { ...sm, cart_id: id })
  }

  const items = data.line_items
  for (const item of items) {
    await simpleLineItemFactory(connection, { ...item, cart_id: id })
  }

  return cart
}
