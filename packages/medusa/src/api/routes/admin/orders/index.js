import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
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
  route.get("/:id", middlewares.wrap(require("./get-order").default))

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
   * Receives the inventory to return from a swap
   */
  route.post(
    "/:id/swaps/:swap_id/receive",
    middlewares.wrap(require("./receive-swap").default)
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
   * Creates claim fulfillment
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

export const defaultRelations = [
  "customer",
  "billing_address",
  "shipping_address",
  "discounts",
  "shipping_methods",
  "payments",
  "fulfillments",
  "fulfillments.tracking_links",
  "fulfillments.items",
  "returns",
  "returns.items",
  "returns.items.reason",
  "gift_cards",
  "gift_card_transactions",
  "items",
  "items.variant",
  "items.variant.product",
  "claims",
  "claims.return_order",
  "claims.shipping_methods",
  "claims.shipping_address",
  "claims.additional_items",
  "claims.additional_items.variant",
  "claims.additional_items.variant.product",
  "claims.fulfillments",
  "claims.claim_items",
  "claims.claim_items.variant",
  "claims.claim_items.variant.product",
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

export const defaultFields = [
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

export const allowedFields = [
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

export const allowedRelations = [
  "customer",
  "region",
  "billing_address",
  "shipping_address",
  "discounts",
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

export const filterableFields = [
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
