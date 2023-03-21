import { Router } from "express"
import "reflect-metadata"
import { Order } from "../../../.."
import middlewares, {
  transformBody,
  transformStoreQuery,
} from "../../../middlewares"
import requireCustomerAuthentication from "../../../middlewares/require-customer-authentication"
import { StorePostCustomersCustomerOrderClaimReq } from "./request-order"
import { StorePostCustomersCustomerAcceptClaimReq } from "./confirm-order-request"
import { StoreGetOrderParams } from "./get-order"
import { StoreGetOrdersParams } from "./lookup-order"
import { FindParams } from "../../../../types/common"

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
  "items.variant.product",
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
  "shipping_total",
  "discount_total",
  "tax_total",
  "items.refundable",
  "refunded_total",
  "gift_card_total",
  "subtotal",
  "total",
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
 * properties:
 *   order:
 *     $ref: "#/components/schemas/Order"
 */
export type StoreOrdersRes = {
  order: Order
}

export * from "./lookup-order"
export * from "./confirm-order-request"
export * from "./request-order"
