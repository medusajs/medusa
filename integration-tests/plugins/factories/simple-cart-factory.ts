import {
  AddressFactoryData,
  simpleAddressFactory,
} from "./simple-address-factory"
import { Connection, DataSource } from "typeorm"
import {
  LineItemFactoryData,
  simpleLineItemFactory,
} from "./simple-line-item-factory"
import { RegionFactoryData, simpleRegionFactory } from "./simple-region-factory"
import {
  ShippingMethodFactoryData,
  simpleShippingMethodFactory,
} from "./simple-shipping-method-factory"

import { Cart } from "@medusajs/medusa"
import faker from "faker"

export type CartFactoryData = {
  id?: string
  region?: RegionFactoryData | string
  email?: string | null
  line_items?: LineItemFactoryData[]
  shipping_address?: AddressFactoryData
  shipping_methods?: ShippingMethodFactoryData[]
  sales_channel_id?: string
}

export const simpleCartFactory = async (
  dataSource: DataSource,
  data: CartFactoryData = {},
  seed: number
): Promise<Cart> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  let regionId: string
  if (typeof data.region === "string") {
    regionId = data.region
  } else {
    const region = await simpleRegionFactory(dataSource, data.region)
    regionId = region.id
  }
  const address = await simpleAddressFactory(dataSource, data.shipping_address)

  const id = data.id || `simple-cart-${Math.random() * 1000}`
  const toSave = manager.create(Cart, {
    id,
    email:
      typeof data.email !== "undefined" ? data.email : faker.internet.email(),
    region_id: regionId,
    shipping_address_id: address.id,
    sales_channel_id: data.sales_channel_id || null,
  })

  const cart = await manager.save(toSave)

  const shippingMethods = data.shipping_methods || []
  for (const sm of shippingMethods) {
    await simpleShippingMethodFactory(dataSource, { ...sm, cart_id: id })
  }

  const items = data.line_items
  for (const item of items || []) {
    await simpleLineItemFactory(dataSource, { ...item, cart_id: id })
  }

  return cart
}
