import { Cart } from "@medusajs/medusa"
import faker from "faker"
import { Connection } from "typeorm"
import {
  AddressFactoryData,
  simpleAddressFactory,
} from "./simple-address-factory"
import { simpleCustomerFactory } from "./simple-customer-factory"
import {
  LineItemFactoryData,
  simpleLineItemFactory,
} from "./simple-line-item-factory"
import { RegionFactoryData, simpleRegionFactory } from "./simple-region-factory"
import {
  SalesChannelFactoryData,
  simpleSalesChannelFactory,
} from "./simple-sales-channel-factory"
import {
  ShippingMethodFactoryData,
  simpleShippingMethodFactory,
} from "./simple-shipping-method-factory"

export type CartFactoryData = {
  id?: string
  customer?: string | { email: string }
  region?: RegionFactoryData | string
  email?: string | null
  line_items?: LineItemFactoryData[]
  shipping_address?: AddressFactoryData
  shipping_methods?: ShippingMethodFactoryData[]
  sales_channel?: SalesChannelFactoryData
}

export const simpleCartFactory = async (
  connection: Connection,
  data: CartFactoryData = {},
  seed?: number
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

  let customerId: string
  if (typeof data.customer === "string") {
    customerId = data.customer
  } else {
    if (data?.customer?.email) {
      const customer = await simpleCustomerFactory(connection, data.customer)
      customerId = customer.id
    } else if (data.email) {
      const customer = await simpleCustomerFactory(connection, {
        email: data.email,
      })
      customerId = customer.id
    }
  }

  const address = await simpleAddressFactory(connection, data.shipping_address)

  let sales_channel
  if (typeof data.sales_channel !== "undefined") {
    sales_channel = await simpleSalesChannelFactory(
      connection,
      data.sales_channel
    )
  }

  const id = data.id || `simple-cart-${Math.random() * 1000}`
  const toSave = manager.create(Cart, {
    id,
    email:
      typeof data.email !== "undefined" ? data.email : faker.internet.email(),
    region_id: regionId,
    customer_id: customerId,
    shipping_address_id: address.id,
    sales_channel_id: sales_channel?.id ?? null,
  })

  const cart = await manager.save(toSave)

  const shippingMethods = data.shipping_methods || []
  for (const sm of shippingMethods) {
    await simpleShippingMethodFactory(connection, { ...sm, cart_id: id })
  }

  const items = data.line_items || []
  for (const item of items) {
    await simpleLineItemFactory(connection, { ...item, cart_id: id })
  }

  return cart
}
