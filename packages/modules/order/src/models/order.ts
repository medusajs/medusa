import { model, OrderStatus } from "@medusajs/framework/utils"
import { Return } from "@models"
import { OrderAddress } from "./address"
import { OrderCreditLine } from "./credit-line"
import { OrderItem } from "./order-item"
import { OrderShipping } from "./order-shipping-method"
import { OrderSummary } from "./order-summary"
import { OrderTransaction } from "./transaction"

const _Order = model
  .define("Order", {
    id: model.id({ prefix: "order" }).primaryKey(),
    display_id: model.autoincrement().searchable(),
    custom_display_id: model.text().nullable(),
    region_id: model.text().nullable(),
    customer_id: model.text().nullable(),
    version: model.number().default(1),
    sales_channel_id: model.text().nullable(),
    status: model.enum(OrderStatus).default(OrderStatus.PENDING),
    is_draft_order: model.boolean().default(false),
    email: model.text().searchable().nullable(),
    currency_code: model.text(),
    locale: model.text().nullable(),
    no_notification: model.boolean().nullable(),
    metadata: model.json().nullable(),
    canceled_at: model.dateTime().nullable(),
    shipping_address: model
      .hasOne<any>(() => OrderAddress, {
        mappedBy: undefined,
        foreignKey: true,
      })
      .searchable()
      .nullable(),
    billing_address: model
      .hasOne<any>(() => OrderAddress, {
        mappedBy: undefined,
        foreignKey: true,
      })
      .searchable()
      .nullable(),
    summary: model.hasMany<any>(() => OrderSummary, {
      mappedBy: "order",
    }),
    items: model.hasMany<any>(() => OrderItem, {
      mappedBy: "order",
    }),
    shipping_methods: model.hasMany<any>(() => OrderShipping, {
      mappedBy: "order",
    }),
    transactions: model.hasMany<any>(() => OrderTransaction, {
      mappedBy: "order",
    }),
    credit_lines: model.hasMany<any>(() => OrderCreditLine, {
      mappedBy: "order",
    }),
    returns: model.hasMany<any>(() => Return, {
      mappedBy: "order",
    }),
  })
  .cascades({
    delete: [
      "summary",
      "items",
      "shipping_methods",
      "transactions",
      "credit_lines",
    ],
  })
  .indexes([
    {
      name: "IDX_order_display_id",
      on: ["display_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_custom_display_id",
      on: ["custom_display_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_region_id",
      on: ["region_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_customer_id",
      on: ["customer_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_sales_channel_id",
      on: ["sales_channel_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
    {
      name: "IDX_order_currency_code",
      on: ["currency_code"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_shipping_address_id",
      on: ["shipping_address_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_billing_address_id",
      on: ["billing_address_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_is_draft_order",
      on: ["is_draft_order"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export const Order = _Order
