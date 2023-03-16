import { Router } from "express"

import { Swap } from "./../../../../"
import middlewares from "../../../middlewares"
import { FindConfig } from "../../../../types/common"

const route = Router()

export default (app) => {
  app.use("/swaps", route)

  route.get(
    "/:cart_id",
    middlewares.wrap(require("./get-swap-by-cart").default)
  )
  route.post("/", middlewares.wrap(require("./create-swap").default))

  return app
}

export const defaultStoreSwapRelations = [
  "order",
  "additional_items",
  "additional_items.variant",
  "return_order",
  "return_order.shipping_method",
  "fulfillments",
  "payment",
  "shipping_address",
  "shipping_methods",
  "cart",
]
export const defaultStoreSwapFields: FindConfig<Swap>["select"] = [
  "id",
  "fulfillment_status",
  "payment_status",
  "order_id",
  "difference_due",
  "shipping_address_id",
  "cart_id",
  "confirmed_at",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
  "idempotency_key",
]

/**
 * @schema StoreSwapsRes
 * type: object
 * x-expanded-relations:
 *   field: swap
 *   relations:
 *     - additional_items
 *     - additional_items.variant
 *     - cart
 *     - fulfillments
 *     - order
 *     - payment
 *     - return_order
 *     - return_order.shipping_method
 *     - shipping_address
 *     - shipping_methods
 *   eager:
 *     - fulfillments.items
 * required:
 *   - swap
 * properties:
 *   swap:
 *     $ref: "#/components/schemas/Swap"
 */
export type StoreSwapsRes = {
  swap: Swap
}

export * from "./create-swap"
export * from "./get-swap-by-cart"
