import { Router } from "express"
import "reflect-metadata"
import { Order } from "../../../.."
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { FindParams, PaginatedResponse } from "../../../../types/common"
import { FlagRouter } from "../../../../utils/flag-router"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { checkRegisteredModules } from "../../../middlewares/check-registered-modules"
import { AdminOrdersOrderLineItemReservationReq } from "./create-reservation-for-line-item"
import { AdminGetOrdersOrderReservationsParams } from "./get-reservations"
import { AdminGetOrdersParams } from "./list-orders"

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  app.use("/orders", route)

  const relations = [...defaultAdminOrdersRelations]
  const defaultFields = [...defaultAdminOrdersFields]

  if (featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key)) {
    relations.push("sales_channel")
    defaultFields.push("sales_channel_id")
  }

  /**
   * List orders
   */
  route.get(
    "/",
    transformQuery(AdminGetOrdersParams, {
      defaultRelations: relations,
      defaultFields: defaultAdminOrdersFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-orders").default)
  )

  /**
   * Get an order
   */
  route.get(
    "/:id",
    transformQuery(FindParams, {
      defaultRelations: relations,
      defaultFields: defaultFields.filter((field) => {
        return ![
          "shipping_total",
          "discount_total",
          "tax_total",
          "refunded_total",
          "total",
          "subtotal",
          "refundable_amount",
          "gift_card_total",
          "gift_card_tax_total",
        ].includes(field)
      }),
      isList: false,
    }),
    middlewares.wrap(require("./get-order").default)
  )

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

  route.get(
    "/:id/reservations",
    checkRegisteredModules({
      inventoryService:
        "Inventory is not enabled. Please add an Inventory module to enable this functionality.",
    }),
    transformQuery(AdminGetOrdersOrderReservationsParams, {
      isList: true,
    }),
    middlewares.wrap(require("./get-reservations").default)
  )

  route.post(
    "/:id/line-items/:line_item_id/reserve",
    checkRegisteredModules({
      inventoryService:
        "Inventory is not enabled. Please add an Inventory module to enable this functionality.",
    }),
    transformBody(AdminOrdersOrderLineItemReservationReq),
    middlewares.wrap(require("./create-reservation-for-line-item").default)
  )

  return app
}

/**
 * @schema AdminOrdersRes
 * type: object
 * required:
 *   - order
 * properties:
 *   order:
 *     $ref: "#/components/schemas/Order"
 */
export type AdminOrdersRes = {
  order: Order
}

/**
 * @schema AdminOrdersListRes
 * type: object
 * required:
 *   - orders
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   orders:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Order"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of items skipped before these items
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminOrdersListRes = PaginatedResponse & {
  orders: Order[]
}

export const defaultAdminOrdersRelations = [
  "customer",
  "billing_address",
  "shipping_address",
  "discounts",
  "discounts.rule",
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
  "claims.return_order.shipping_method.tax_lines",
  "claims.shipping_methods",
  "claims.shipping_address",
  "claims.additional_items",
  "claims.additional_items.variant",
  "claims.fulfillments",
  "claims.fulfillments.tracking_links",
  "claims.claim_items",
  "claims.claim_items.item",
  "claims.claim_items.images",
  // "claims.claim_items.tags",
  "swaps",
  "swaps.return_order",
  "swaps.return_order.shipping_method",
  "swaps.return_order.shipping_method.tax_lines",
  "swaps.payment",
  "swaps.shipping_methods",
  "swaps.shipping_methods.tax_lines",
  "swaps.shipping_address",
  "swaps.additional_items",
  "swaps.additional_items.variant",
  "swaps.fulfillments",
  "swaps.fulfillments.tracking_links",
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
] as (keyof Order)[]

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
export * from "./create-shipment"
export * from "./create-swap"
export * from "./create-swap-shipment"
export * from "./fulfill-claim"
export * from "./fulfill-swap"
export * from "./get-order"
export * from "./list-orders"
export * from "./process-swap-payment"
export * from "./refund-payment"
export * from "./request-return"
export * from "./update-claim"
export * from "./update-order"
