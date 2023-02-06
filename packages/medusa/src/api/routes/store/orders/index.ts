import { Router } from "express"
import "reflect-metadata"
import { Order } from "../../../.."
import middlewares, { transformBody } from "../../../middlewares"
import requireCustomerAuthentication from "../../../middlewares/require-customer-authentication"
import { StorePostCustomersCustomerOrderClaimReq } from "./request-order"
import { StorePostCustomersCustomerAcceptClaimReq } from "./confirm-order-request"

const route = Router()

export default (app) => {
  app.use("/orders", route)

  /**
   * Lookup
   */
  route.get("/", middlewares.wrap(require("./lookup-order").default))

  /**
   * Retrieve Order
   */
  route.get("/:id", middlewares.wrap(require("./get-order").default))

  /**
   * Retrieve by Cart Id
   */
  route.get(
    "/cart/:cart_id",
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
