import { Router } from "express"
import { Cart, DraftOrder, Order } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"

const route = Router()

export default (app) => {
  app.use("/draft-orders", route)

  route.get("/", require("./list-draft-orders").default)

  route.get("/:id", require("./get-draft-order").default)

  route.post("/", require("./create-draft-order").default)

  route.post("/:id", require("./update-draft-order").default)

  route.delete("/:id", require("./delete-draft-order").default)

  route.delete(
    "/:id/line-items/:line_id",
    require("./delete-line-item").default
  )

  route.post("/:id/line-items", require("./create-line-item").default)

  route.post("/:id/line-items/:line_id", require("./update-line-item").default)

  route.post("/", require("./create-draft-order").default)

  route.post("/:id/pay", require("./register-payment").default)

  return app
}

export const defaultAdminDraftOrdersRelations = [
  "order",
  "cart",
  "cart.items",
  "cart.items.adjustments",
]

export const defaultAdminDraftOrdersCartRelations = [
  "region",
  "items",
  "items.adjustments",
  "payment",
  "shipping_address",
  "billing_address",
  "region.payment_providers",
  "shipping_methods",
  "payment_sessions",
  "shipping_methods.shipping_option",
  "discounts",
  "customer",
  "discounts.rule",
]

export const defaultAdminDraftOrdersCartFields: (keyof Cart)[] = [
  "subtotal",
  "tax_total",
  "shipping_total",
  "discount_total",
  "gift_card_total",
  "total",
]

export const defaultAdminDraftOrdersFields: (keyof DraftOrder)[] = [
  "id",
  "status",
  "display_id",
  "cart_id",
  "order_id",
  "canceled_at",
  "created_at",
  "updated_at",
  "metadata",
  "no_notification_order",
]

export const allowedAdminDraftOrdersFields = [
  "id",
  "status",
  "display_id",
  "cart_id",
  "canceled_at",
  "created_at",
  "updated_at",
  "metadata",
  "no_notification_order",
]

export const allowedAdminDraftOrdersRelations = ["cart"]

export type AdminPostDraftOrdersDraftOrderRegisterPaymentRes = {
  order: Order
}

export type AdminDraftOrdersRes = {
  draft_order: DraftOrder
}

export type AdminDraftOrdersDeleteRes = DeleteResponse

export type AdminDraftOrdersListRes = PaginatedResponse & {
  draft_orders: DraftOrder[]
}

export * from "./create-draft-order"
export * from "./create-line-item"
export * from "./delete-draft-order"
export * from "./delete-line-item"
export * from "./get-draft-order"
export * from "./list-draft-orders"
export * from "./register-payment"
export * from "./update-draft-order"
export * from "./update-line-item"
