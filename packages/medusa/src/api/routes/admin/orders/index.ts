import { Router } from "express"
import { Order } from "../../../.."
import middlewares from "../../../middlewares"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import "reflect-metadata"

const route = Router()

export default (app) => {
  app.use("/orders", route)

  /**
   * List orders
   */
  route.get(
    "/",
    middlewares.normalizeQuery(),
    middlewares.wrap(require("./list-orders").default)
  )

  /**
   * Get an order
   */
  route.get(
    "/:id",
    middlewares.normalizeQuery(),
    middlewares.wrap(require("./get-order").default)
  )

  /**
   * Create a new order
   */
  route.post("/", middlewares.wrap(require("./create-order").default))

  /**
   * Update an order
   */
  route.post("/:id", middlewares.wrap(require("./update-order").default))

  /**
   * Mark an order as completed
   */
  route.post(
    "/:id/complete",
    middlewares.wrap(require("./complete-order").default)
  )

  /**
   * Refund an amount to the customer's card.
   */
  route.post(
    "/:id/refund",
    middlewares.wrap(require("./refund-payment").default)
  )

  /**
   * Capture the authorized amount on the customer's card.
   */
  route.post(
    "/:id/capture",
    middlewares.wrap(require("./capture-payment").default)
  )

  /**
   * Create a fulfillment.
   */
  route.post(
    "/:id/fulfillment",
    middlewares.wrap(require("./create-fulfillment").default)
  )

  /**
   * Cancel a fulfillment related to an order.
   */
  route.post(
    "/:id/fulfillments/:fulfillment_id/cancel",
    middlewares.wrap(require("./cancel-fulfillment").default)
  )

  /**
   * Cancel a fulfillment related to a swap.
   */
  route.post(
    "/:id/swaps/:swap_id/fulfillments/:fulfillment_id/cancel",
    middlewares.wrap(require("./cancel-fulfillment-swap").default)
  )

  /**
   * Cancel a fulfillment related to a claim.
   */
  route.post(
    "/:id/claims/:claim_id/fulfillments/:fulfillment_id/cancel",
    middlewares.wrap(require("./cancel-fulfillment-claim").default)
  )

  /**
   * Create a shipment.
   */
  route.post(
    "/:id/shipment",
    middlewares.wrap(require("./create-shipment").default)
  )

  /**
   * Request a return.
   */
  route.post(
    "/:id/return",
    middlewares.wrap(require("./request-return").default)
  )

  /**
   * Cancel an order.
   */
  route.post("/:id/cancel", middlewares.wrap(require("./cancel-order").default))

  /**
   * Add a shipping method
   */
  route.post(
    "/:id/shipping-methods",
    middlewares.wrap(require("./add-shipping-method").default)
  )

  /**
   * Archive an order.
   */
  route.post(
    "/:id/archive",
    middlewares.wrap(require("./archive-order").default)
  )

  /**
   * Creates a swap, requests a return and prepares a cart for payment.
   */
  route.post("/:id/swaps", middlewares.wrap(require("./create-swap").default))

  /**
   * Cancels a swap.
   */
  route.post(
    "/:id/swaps/:swap_id/cancel",
    middlewares.wrap(require("./cancel-swap").default)
  )

  /**
   * Fulfills a swap.
   */
  route.post(
    "/:id/swaps/:swap_id/fulfillments",
    middlewares.wrap(require("./fulfill-swap").default)
  )

  /**
   * Marks a swap fulfillment as shipped.
   */
  route.post(
    "/:id/swaps/:swap_id/shipments",
    middlewares.wrap(require("./create-swap-shipment").default)
  )

  /**
   * Captures the payment associated with a swap
   */
  route.post(
    "/:id/swaps/:swap_id/process-payment",
    middlewares.wrap(require("./process-swap-payment").default)
  )

  /**
   * Creates a claim
   */
  route.post("/:id/claims", middlewares.wrap(require("./create-claim").default))

  /**
   * Cancels a claim
   */
  route.post(
    "/:id/claims/:claim_id/cancel",
    middlewares.wrap(require("./cancel-claim").default)
  )

  /**
   * Updates a claim
   */
  route.post(
    "/:id/claims/:claim_id",
    middlewares.wrap(require("./update-claim").default)
  )

  /**
   * Creates claim fulfillment
   */
  route.post(
    "/:id/claims/:claim_id/fulfillments",
    middlewares.wrap(require("./fulfill-claim").default)
  )

  /**
   * Creates claim shipment
   */
  route.post(
    "/:id/claims/:claim_id/shipments",
    middlewares.wrap(require("./create-claim-shipment").default)
  )

  /**
   * Delete metadata key / value pair.
   */
  route.delete(
    "/:id/metadata/:key",
    middlewares.wrap(require("./delete-metadata").default)
  )

  return app
}

export type AdminOrdersRes = {
  order: Order
}

export type AdminDeleteRes = DeleteResponse

export type AdminOrdersListRes = PaginatedResponse & {
  orders: Order[]
}

export const defaultAdminOrdersRelations = [
  "customer",
  "billing_address",
  "shipping_address",
  "discounts",
  "discounts.rule",
  "discounts.rule.valid_for",
  "shipping_methods",
  "payments",
  "fulfillments",
  "fulfillments.tracking_links",
  "fulfillments.items",
  "returns",
  "returns.shipping_method",
  "returns.shipping_method.tax_lines",
  "returns.items",
  "returns.items.reason",
  "gift_cards",
  "gift_card_transactions",
  "claims",
  "claims.return_order",
  "claims.return_order.shipping_method",
  "claims.shipping_methods",
  "claims.shipping_address",
  "claims.additional_items",
  "claims.fulfillments",
  "claims.claim_items",
  "claims.claim_items.item",
  "claims.claim_items.images",
  // "claims.claim_items.tags",
  "swaps",
  "swaps.return_order",
  "swaps.payment",
  "swaps.shipping_methods",
  "swaps.shipping_address",
  "swaps.additional_items",
  "swaps.fulfillments",
]

export const defaultAdminOrdersFields = [
  "id",
  "status",
  "fulfillment_status",
  "payment_status",
  "display_id",
  "cart_id",
  "draft_order_id",
  "customer_id",
  "email",
  "region_id",
  "currency_code",
  "tax_rate",
  "canceled_at",
  "created_at",
  "updated_at",
  "metadata",
  "items.refundable",
  "swaps.additional_items.refundable",
  "claims.additional_items.refundable",
  "shipping_total",
  "discount_total",
  "tax_total",
  "refunded_total",
  "gift_card_total",
  "subtotal",
  "total",
  "paid_total",
  "refundable_amount",
  "no_notification",
]

export const allowedAdminOrdersFields = [
  "id",
  "status",
  "fulfillment_status",
  "payment_status",
  "display_id",
  "cart_id",
  "draft_order_id",
  "customer_id",
  "email",
  "region_id",
  "currency_code",
  "tax_rate",
  "canceled_at",
  "created_at",
  "updated_at",
  "metadata",
  "shipping_total",
  "discount_total",
  "tax_total",
  "refunded_total",
  "subtotal",
  "gift_card_total",
  "total",
  "paid_total",
  "refundable_amount",
  "no_notification",
]

export const allowedAdminOrdersRelations = [
  "customer",
  "region",
  "billing_address",
  "shipping_address",
  "discounts",
  "discounts.rule",
  "discounts.rule.valid_for",
  "shipping_methods",
  "payments",
  "fulfillments",
  "fulfillments.tracking_links",
  "returns",
  "claims",
  "swaps",
  "swaps.return_order",
  "swaps.additional_items",
]

export const filterableAdminOrdersFields = [
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
  "canceled_at",
  "created_at",
  "updated_at",
]

export * from "./add-shipping-method"
export * from "./archive-order"
export * from "./cancel-claim"
export * from "./cancel-fulfillment"
export * from "./cancel-fulfillment-claim"
export * from "./cancel-fulfillment-swap"
export * from "./cancel-order"
export * from "./cancel-swap"
export * from "./capture-payment"
export * from "./complete-order"
export * from "./create-claim"
export * from "./create-claim-shipment"
export * from "./create-fulfillment"
export * from "./create-order"
export * from "./create-shipment"
export * from "./create-swap"
export * from "./create-swap-shipment"
export * from "./delete-metadata"
export * from "./fulfill-claim"
export * from "./fulfill-swap"
export * from "./get-order"
export * from "./list-orders"
export * from "./process-swap-payment"
export * from "./refund-payment"
export * from "./request-return"
export * from "./update-claim"
export * from "./update-order"
