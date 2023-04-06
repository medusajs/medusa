import { DataSource } from "typeorm"
import faker from "faker"
import {
  Discount,
  FulfillmentStatus,
  Order,
  PaymentStatus,
  Refund,
} from "@medusajs/medusa"
import {
  DiscountFactoryData,
  simpleDiscountFactory,
} from "./simple-discount-factory"
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
import {
  SalesChannelFactoryData,
  simpleSalesChannelFactory,
} from "./simple-sales-channel-factory"
import {
  CustomerFactoryData,
  simpleCustomerFactory,
} from "./simple-customer-factory"

export type OrderFactoryData = {
  id?: string
  payment_status?: PaymentStatus
  fulfillment_status?: FulfillmentStatus
  region?: RegionFactoryData | string
  email?: string | null
  customer?: CustomerFactoryData | null
  currency_code?: string
  tax_rate?: number | null
  line_items?: LineItemFactoryData[]
  discounts?: DiscountFactoryData[]
  shipping_address?: AddressFactoryData
  shipping_methods?: ShippingMethodFactoryData[]
  sales_channel?: SalesChannelFactoryData
  refunds: Refund[]
}

export const simpleOrderFactory = async (
  dataSource: DataSource,
  data: OrderFactoryData = {} as OrderFactoryData,
  seed?: number
): Promise<Order> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  let currencyCode: string
  let regionId: string
  let taxRate: number

  if (typeof data.region === "string") {
    currencyCode = data.currency_code as string
    regionId = data.region
    taxRate = data.tax_rate as number
  } else {
    const region = await simpleRegionFactory(dataSource, data.region)
    taxRate =
      (typeof data.tax_rate !== "undefined" ? data.tax_rate : region.tax_rate) as number
    currencyCode = region.currency_code
    regionId = region.id
  }

  const address = await simpleAddressFactory(dataSource, data.shipping_address)

  const customer = await simpleCustomerFactory(dataSource, {
    ...data.customer,
    email: data.email ?? undefined,
  })

  let discounts: Discount[] = []
  if (typeof data.discounts !== "undefined") {
    discounts = await Promise.all(
      data.discounts.map((d) => simpleDiscountFactory(dataSource, d, seed))
    )
  }

  let sales_channel
  if (typeof data.sales_channel !== "undefined") {
    sales_channel = await simpleSalesChannelFactory(
      dataSource,
      data.sales_channel
    )
  }

  const id = data.id || `simple-order-${Math.random() * 1000}`
  const toSave = manager.create(Order, {
    id,
    discounts,
    payment_status: data.payment_status ?? PaymentStatus.AWAITING,
    fulfillment_status:
      data.fulfillment_status ?? FulfillmentStatus.NOT_FULFILLED,
    customer_id: customer.id,
    email: customer.email,
    region_id: regionId,
    currency_code: currencyCode,
    tax_rate: taxRate,
    shipping_address_id: address.id,
    sales_channel_id: sales_channel?.id ?? null,
    refunds: data.refunds ?? []
  })

  const order = await manager.save(toSave)

  const shippingMethods = data.shipping_methods || []
  for (const sm of shippingMethods) {
    await simpleShippingMethodFactory(dataSource, { ...sm, order_id: order.id })
  }

  const items =
    data.line_items?.map((item) => {
      const adjustments = item?.adjustments || []
      return {
        ...item,
        adjustments: adjustments.map((adj) => ({
          ...adj,
          discount_id: discounts.find((d) => d.code === adj?.discount_code),
        })),
      }
    }) || []

  for (const item of items) {
    await simpleLineItemFactory(dataSource, { ...item, order_id: id } as unknown as LineItemFactoryData)
  }

  return order
}
