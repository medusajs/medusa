import { DeepPartial } from "typeorm"
import { IdMap } from "medusa-test-utils"
import {
  FulfillmentStatus,
  Order,
  OrderStatus,
  PaymentStatus,
} from "../../models"

const createdAtDate = new Date("2019-01-01T00:00:00.000Z")

export const ordersToExport: DeepPartial<Order>[] = [
  {
    id: "order_1",
    created_at: createdAtDate,
    display_id: 123,
    status: OrderStatus.PENDING,
    fulfillment_status: FulfillmentStatus.PARTIALLY_FULFILLED,
    payment_status: PaymentStatus.CAPTURED,
    subtotal: 10,
    shipping_total: 10,
    discount_total: 0,
    gift_card_total: 0,
    refunded_total: 0,
    tax_total: 5,
    total: 25,
    currency_code: "usd",
    region_id: "region_1",
    shipping_address: {
      id: "address_1",
      address_1: "123 Main St",
      address_2: "",
      city: "New York",
      country_code: "US",
      postal_code: "10001",
    },
    customer: {
      id: "customer_1",
      first_name: "John",
      last_name: "Doe",
      email: "John@Doe.com",
    },
    sales_channel: {
      id: IdMap.getId("sc_1"),
      name: "SC 1",
      description: "SC 1",
    },
  },
  {
    id: "order_2",
    created_at: createdAtDate,
    display_id: 124,
    status: OrderStatus.COMPLETED,
    fulfillment_status: FulfillmentStatus.FULFILLED,
    payment_status: PaymentStatus.CAPTURED,
    subtotal: 125,
    shipping_total: 10,
    discount_total: 0,
    gift_card_total: 0,
    refunded_total: 0,
    tax_total: 0,
    total: 135,
    currency_code: "eur",
    region_id: "region_2",
    shipping_address: {
      id: "address_2",
      address_1: "Hovedgaden 1",
      address_2: "",
      city: "Copenhagen",
      country_code: "DK",
      postal_code: "1150",
    },
    customer: {
      id: "customer_2",
      first_name: "Jane",
      last_name: "Doe",
      email: "Jane@Doe.com",
    },
    sales_channel: {
      id: IdMap.getId("sc_2"),
      name: "SC 2",
      description: "SC 2",
    },
  },
]
