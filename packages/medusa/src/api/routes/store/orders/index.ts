import { Router } from "express"
import "reflect-metadata"
import { Order } from "../../../.."
import { FindParams } from "../../../../types/common"
import middlewares, {
  transformBody,
  transformStoreQuery,
} from "../../../middlewares"
import requireCustomerAuthentication from "../../../middlewares/require-customer-authentication"
import { StorePostCustomersCustomerAcceptClaimReq } from "./confirm-order-request"
import { StoreGetOrderParams } from "./get-order"
import { StoreGetOrdersParams } from "./lookup-order"
import { StorePostCustomersCustomerOrderClaimReq } from "./request-order"

const route = Router()

export default (app) => {
  app.use("/orders", route)

  /**
   * Lookup
   */
  route.get(
    "/",
    transformStoreQuery(StoreGetOrdersParams, {
      defaultFields: defaultStoreOrdersFields,
      defaultRelations: defaultStoreOrdersRelations,
      allowedFields: allowedStoreOrdersFields,
      allowedRelations: allowedStoreOrdersRelations,
      isList: true,
    }),
    middlewares.wrap(require("./lookup-order").default)
  )

  /**
   * Retrieve Order
   */
  route.get(
    "/:id",
    transformStoreQuery(StoreGetOrderParams, {
      defaultFields: defaultStoreOrdersFields,
      defaultRelations: defaultStoreOrdersRelations,
      allowedFields: allowedStoreOrdersFields,
      allowedRelations: allowedStoreOrdersRelations,
    }),
    middlewares.wrap(require("./get-order").default)
  )

  /**
   * Retrieve by Cart Id
   */
  route.get(
    "/cart/:cart_id",
    transformStoreQuery(FindParams, {
      defaultFields: defaultStoreOrdersFields,
      defaultRelations: defaultStoreOrdersRelations,
      allowedFields: allowedStoreOrdersFields,
      allowedRelations: allowedStoreOrdersRelations,
    }),
    middlewares.wrap(require("./get-order-by-cart").default)
  )

  route.post(
    "/customer/confirm",
    transformBody(StorePostCustomersCustomerAcceptClaimReq),
    middlewares.wrap(require("./confirm-order-request").default)
  )

  route.post(
    "/batch/customer/token",
    requireCustomerAuthentication(),
    transformBody(StorePostCustomersCustomerOrderClaimReq),
    middlewares.wrap(require("./request-order").default)
  )

  return app
}

export const defaultStoreOrdersRelations = [
  "shipping_address",
  "fulfillments",
  "fulfillments.tracking_links",
  "items",
  "items.variant",
  "shipping_methods",
  "discounts",
  "discounts.rule",
  "customer",
  "payments",
  "region",
]

export const allowedStoreOrdersRelations = [
  ...defaultStoreOrdersRelations,
  "billing_address",
]

export const defaultStoreOrdersFields = [
  "id",
  "status",
  "fulfillment_status",
  "payment_status",
  "display_id",
  "cart_id",
  "customer_id",
  "email",
  "region_id",
  "currency_code",
  "tax_rate",
  "created_at",
  "items.refundable",
] as (keyof Order)[]

export const allowedStoreOrdersFields = [
  ...defaultStoreOrdersFields,
  "object",
  "shipping_total",
  "discount_total",
  "tax_total",
  "refunded_total",
  "total",
  "subtotal",
  "paid_total",
  "refundable_amount",
  "gift_card_total",
  "gift_card_tax_total",
]

/**
 * @schema StoreOrdersRes
 * type: object
 * required:
 *   - order
 * x-expanded-relations:
 *   field: order
 *   relations:
 *     - customer
 *     - discounts
 *     - discounts.rule
 *     - fulfillments
 *     - fulfillments.tracking_links
 *     - items
 *     - items.variant
 *     - payments
 *     - region
 *     - shipping_address
 *     - shipping_methods
 *   eager:
 *     - fulfillments.items
 *     - region.fulfillment_providers
 *     - region.payment_providers
 *     - shipping_methods.shipping_option
 *   implicit:
 *     - claims
 *     - claims.additional_items
 *     - claims.additional_items.adjustments
 *     - claims.additional_items.refundable
 *     - claims.additional_items.tax_lines
 *     - discounts
 *     - discounts.rule
 *     - gift_card_transactions
 *     - gift_card_transactions.gift_card
 *     - gift_cards
 *     - items
 *     - items.adjustments
 *     - items.refundable
 *     - items.tax_lines
 *     - items.variant
 *     - items.variant.product
 *     - refunds
 *     - region
 *     - shipping_methods
 *     - shipping_methods.tax_lines
 *     - swaps
 *     - swaps.additional_items
 *     - swaps.additional_items.adjustments
 *     - swaps.additional_items.refundable
 *     - swaps.additional_items.tax_lines
 *   totals:
 *     - discount_total
 *     - gift_card_tax_total
 *     - gift_card_total
 *     - paid_total
 *     - refundable_amount
 *     - refunded_total
 *     - shipping_total
 *     - subtotal
 *     - tax_total
 *     - total
 *     - claims.additional_items.discount_total
 *     - claims.additional_items.gift_card_total
 *     - claims.additional_items.original_tax_total
 *     - claims.additional_items.original_total
 *     - claims.additional_items.refundable
 *     - claims.additional_items.subtotal
 *     - claims.additional_items.tax_total
 *     - claims.additional_items.total
 *     - items.discount_total
 *     - items.gift_card_total
 *     - items.original_tax_total
 *     - items.original_total
 *     - items.refundable
 *     - items.subtotal
 *     - items.tax_total
 *     - items.total
 *     - swaps.additional_items.discount_total
 *     - swaps.additional_items.gift_card_total
 *     - swaps.additional_items.original_tax_total
 *     - swaps.additional_items.original_total
 *     - swaps.additional_items.refundable
 *     - swaps.additional_items.subtotal
 *     - swaps.additional_items.tax_total
 *     - swaps.additional_items.total
 * properties:
 *   order:
 *     $ref: "#/components/schemas/Order"
 */
export type StoreOrdersRes = {
  order: Order
}

export * from "./confirm-order-request"
export * from "./lookup-order"
export * from "./request-order"
