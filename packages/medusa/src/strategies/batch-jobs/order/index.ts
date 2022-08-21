import { BatchJob, Order } from "../../../models"
import { Selector } from "../../../types/common"

export type OrderExportBatchJobContext = {
  offset?: number
  limit?: number
  order?: string
  fields?: string
  expand?: string

  list_config?: {
    select?: string[]
    relations?: string[]
    skip?: number
    take?: number
    order?: Record<string, "ASC" | "DESC">
  }
  filterable_fields?: Selector<Order>

  retry_count?: number
  max_retry?: number
  batch_size?: number
}

export type OrderExportBatchJob = BatchJob & {
  context: OrderExportBatchJobContext
}

export type OrderDescriptor = {
  fieldName: string
  title: string
  accessor: (entity: Order) => string
}

export const orderExportPropertiesDescriptors: OrderDescriptor[] = [
  {
    fieldName: "id",
    title: "Order_ID",
    accessor: (order: Order): string => order.id,
  },
  {
    fieldName: "display_id",
    title: "Display_ID",
    accessor: (order: Order): string => order.display_id.toString(),
  },
  {
    fieldName: "status",
    title: "Order status",
    accessor: (order: Order): string => order.status.toString(),
  },

  {
    fieldName: "created_at",
    title: "Date",
    accessor: (order: Order): string => order.created_at.toUTCString(),
  },

  {
    fieldName: "customer",
    title: [
      "Customer First name",
      "Customer Last name",
      "Customer Email",
      "Customer ID",
    ].join(";"),
    accessor: (order: Order): string =>
      [
        order.customer.first_name,
        order.customer.last_name,
        order.customer.email,
        order.customer.id,
      ].join(";"),
  },

  {
    fieldName: "shipping_address",
    title: [
      "Shipping Address 1",
      "Shipping Address 2",
      "Shipping Country Code",
      "Shipping City",
      "Shipping Postal Code",
      "Shipping Region ID",
    ].join(";"),
    accessor: (order: Order): string =>
      [
        order.shipping_address?.address_1,
        order.shipping_address?.address_2,
        order.shipping_address?.country_code,
        order.shipping_address?.city,
        order.shipping_address?.postal_code,
        order.region_id,
      ].join(";"),
  },

  {
    fieldName: "fulfillment_status",
    title: "Fulfillment Status",
    accessor: (order: Order): string => order.fulfillment_status,
  },

  {
    fieldName: "payment_status",
    title: "Payment Status",
    accessor: (order: Order): string => order.payment_status,
  },

  {
    fieldName: "subtotal",
    title: "Subtotal",
    accessor: (order: Order): string => order.subtotal.toString(),
  },

  {
    fieldName: "shipping_total",
    title: "Shipping Total",
    accessor: (order: Order): string => order.shipping_total.toString(),
  },

  {
    fieldName: "discount_total",
    title: "Discount Total",
    accessor: (order: Order): string => order.discount_total.toString(),
  },

  {
    fieldName: "gift_card_total",
    title: "Gift Card Total",
    accessor: (order: Order): string => order.gift_card_total.toString(),
  },

  {
    fieldName: "refunded_total",
    title: "Refunded Total",
    accessor: (order: Order): string => order.refunded_total.toString(),
  },
  {
    fieldName: "tax_total",
    title: "Tax Total",
    accessor: (order: Order): string => order.tax_total?.toString() ?? "",
  },
  {
    fieldName: "total",
    title: "Total",
    accessor: (order: Order): string => order.total.toString(),
  },

  {
    fieldName: "currency_code",
    title: "Currency Code",
    accessor: (order: Order): string => order.currency_code,
  },
]
