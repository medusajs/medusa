import { Router } from "express"
import { Swap } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/swaps", route)

  /**
   * List swaps
   */
  route.get("/", middlewares.wrap(require("./list-swaps").default))

  /**
   * Get a swap
   */
  route.get("/:id", middlewares.wrap(require("./get-swap").default))

  return app
}

export const defaultAdminSwapRelations = [
  "additional_items",
  "additional_items.adjustments",
  "cart",
  "cart.items",
  "cart.items.adjustments",
  "cart.items.variant",
  "fulfillments",
  "order",
  "payment",
  "return_order",
  "shipping_address",
  "shipping_methods",
]

export const defaultAdminSwapFields = [
  "id",
  "fulfillment_status",
  "payment_status",
  "order_id",
  "difference_due",
  "cart_id",
  "created_at",
  "updated_at",
  "metadata",
  "cart.subtotal",
  "cart.tax_total",
  "cart.shipping_total",
  "cart.discount_total",
  "cart.gift_card_total",
  "cart.total",
]

/**
 * @schema AdminSwapsListRes
 * type: object
 * required:
 *   - swaps
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   swaps:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Swap"
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
export type AdminSwapsListRes = PaginatedResponse & {
  swaps: Swap[]
}

/**
 * @schema AdminSwapsRes
 * type: object
 * x-expanded-relations:
 *   field: swap
 *   relations:
 *     - additional_items
 *     - additional_items.adjustments
 *     - cart
 *     - cart.items
 *     - cart.items.adjustments
 *     - cart.items.variant
 *     - fulfillments
 *     - order
 *     - payment
 *     - return_order
 *     - shipping_address
 *     - shipping_methods
 *   eager:
 *     - fulfillments.items
 *     - shipping_methods.shipping_option
 * required:
 *   - swap
 * properties:
 *   swap:
 *     $ref: "#/components/schemas/Swap"
 */
export type AdminSwapsRes = {
  swap: Swap
}

export * from "./get-swap"
export * from "./list-swaps"
