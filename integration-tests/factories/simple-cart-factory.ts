import { Cart } from "@medusajs/medusa"
import { generateEntityId } from "@medusajs/utils"
import faker from "faker"
import { DataSource } from "typeorm"
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
  sales_channel_id?: string
}

const isMedusaV2Enabled = process.env.MEDUSA_FF_MEDUSA_V2 == "true"

export const simpleCartFactory = async (
  dataSource: DataSource,
  data: CartFactoryData = {},
  seed?: number
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

  let customerId!: string
  if (typeof data.customer === "string") {
    customerId = data.customer
  } else {
    if (data?.customer?.email) {
      const customer = await simpleCustomerFactory(dataSource, data.customer)
      customerId = customer.id
    } else if (data.email) {
      const customer = await simpleCustomerFactory(dataSource, {
        email: data.email,
      })
      customerId = customer.id
    }
  }

  const address = await simpleAddressFactory(dataSource, data.shipping_address)

  let sales_channel
  if (typeof data.sales_channel !== "undefined") {
    sales_channel = await simpleSalesChannelFactory(
      dataSource,
      data.sales_channel
    )
  }

  const id = data.id || `simple-cart-${Math.random() * 1000}`
  let toSave = {
    id,
    email:
      typeof data.email !== "undefined" ? data.email : faker.internet.email(),
    region_id: regionId,
    customer_id: customerId,
    shipping_address_id: address.id,
    sales_channel_id: sales_channel?.id ?? data.sales_channel_id ?? null,
  }

  if (isMedusaV2Enabled) {
    await manager.query(
      `INSERT INTO "cart_sales_channel" (id, cart_id, sales_channel_id) 
        VALUES ('${generateEntityId(undefined, "cartsc")}', '${toSave.id}', '${
        sales_channel?.id ?? data.sales_channel_id
      }');`
    )
  }

  toSave = manager.create(Cart, toSave)

  const cart = await manager.save(toSave)

  const shippingMethods = data.shipping_methods || []
  for (const sm of shippingMethods) {
    await simpleShippingMethodFactory(dataSource, { ...sm, cart_id: id })
  }

  const items = data.line_items || []
  for (const item of items) {
    await simpleLineItemFactory(dataSource, { ...item, cart_id: id })
  }

  return cart
}
