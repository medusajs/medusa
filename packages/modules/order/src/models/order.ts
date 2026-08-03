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
    /**
     * An auto-incremented display ID for the order.
     */
    display_id: model.autoincrement().searchable(),
    /**
     * A custom display ID for the order.
     */
    custom_display_id: model.text().searchable().nullable(),
    /**
     * The ID of the region the order belongs to.
     */
    region_id: model.text().nullable(),
    /**
     * The ID of the customer that placed the order.
     */
    customer_id: model.text().nullable(),
    /**
     * The order's version number.
     */
    version: model.number().default(1),
    /**
     * The ID of the sales channel the order was placed in.
     */
    sales_channel_id: model.text().nullable(),
    /**
     * The order's status.
     */
    status: model.enum(OrderStatus).default(OrderStatus.PENDING),
    /**
     * Whether the order is a draft order.
     */
    is_draft_order: model.boolean().default(false),
    /**
     * The email associated with the order.
     */
    email: model.text().searchable().nullable(),
    /**
     * The ISO 3 character currency code of the order.
     * @example "usd"
     */
    currency_code: model.text(),
    /**
     * The BCP 47 language tag of the order's locale.
     * @example "en-US"
     */
    locale: model.text().nullable(),
    /**
     * Whether notifications should be sent for this order.
     */
    no_notification: model.boolean().nullable(),
    /**
     * Custom key-value metadata for the order.
     */
    metadata: model.json().nullable(),
    /**
     * The date the order was canceled.
     */
    canceled_at: model.dateTime().nullable(),
    /**
     * The associated shipping address.
     */
    shipping_address: model
      .hasOne<any>(() => OrderAddress, {
        mappedBy: undefined,
        foreignKey: true,
      })
      .searchable()
      .nullable(),
    /**
     * The associated billing address.
     */
    billing_address: model
      .hasOne<any>(() => OrderAddress, {
        mappedBy: undefined,
        foreignKey: true,
      })
      .searchable()
      .nullable(),
    /**
     * The associated order summaries.
     */
    summary: model.hasMany<any>(() => OrderSummary, {
      mappedBy: "order",
    }),
    /**
     * The associated order items.
     */
    items: model.hasMany<any>(() => OrderItem, {
      mappedBy: "order",
    }),
    /**
     * The associated shipping methods.
     */
    shipping_methods: model.hasMany<any>(() => OrderShipping, {
      mappedBy: "order",
    }),
    /**
     * The associated transactions.
     */
    transactions: model.hasMany<any>(() => OrderTransaction, {
      mappedBy: "order",
    }),
    /**
     * The associated credit lines.
     */
    credit_lines: model.hasMany<any>(() => OrderCreditLine, {
      mappedBy: "order",
    }),
    /**
     * The associated returns.
     */
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

/**
 * An order placed by a customer.
 */
export const Order = _Order
