import { Swap } from "./../../../../"
import { Router } from "express"

const route = Router()

export default (app) => {
  app.use("/swaps", route)

  route.get("/:cart_id", require("./get-swap-by-cart").default)
  route.post("/", require("./create-swap").default)

  return app
}

export const defaultStoreSwapRelations = [
  "order",
  "additional_items",
  "return_order",
  "return_order.shipping_method",
  "fulfillments",
  "payment",
  "shipping_address",
  "shipping_methods",
  "cart",
]
export const defaultStoreSwapFields = [
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

export type StoreSwapsRes = {
  swap: Swap
}

export * from "./create-swap"
export * from "./get-swap-by-cart"
