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
  "order",
  "additional_items",
  "additional_items.adjustments",
  "return_order",
  "fulfillments",
  "payment",
  "shipping_address",
  "shipping_methods",
  "cart",
  "cart.items",
  "cart.items.adjustments",
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
 * properties:
 *   swap:
 *     $ref: "#/components/schemas/Swap"
 */
export type AdminSwapsRes = {
  swap: Swap
}

export * from "./get-swap"
export * from "./list-swaps"
