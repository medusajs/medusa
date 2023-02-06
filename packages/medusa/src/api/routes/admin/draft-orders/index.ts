import { Router } from "express"
import { Cart, DraftOrder, Order } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/draft-orders", route)

  route.get("/", middlewares.wrap(require("./list-draft-orders").default))

  route.get("/:id", middlewares.wrap(require("./get-draft-order").default))

  route.post("/", middlewares.wrap(require("./create-draft-order").default))

  route.post("/:id", middlewares.wrap(require("./update-draft-order").default))

  route.delete(
    "/:id",
    middlewares.wrap(require("./delete-draft-order").default)
  )

  route.delete(
    "/:id/line-items/:line_id",
    middlewares.wrap(require("./delete-line-item").default)
  )

  route.post(
    "/:id/line-items",
    middlewares.wrap(require("./create-line-item").default)
  )

  route.post(
    "/:id/line-items/:line_id",
    middlewares.wrap(require("./update-line-item").default)
  )

  route.post("/", middlewares.wrap(require("./create-draft-order").default))

  route.post(
    "/:id/pay",
    middlewares.wrap(require("./register-payment").default)
  )

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

/**
 * @schema AdminPostDraftOrdersDraftOrderRegisterPaymentRes
 * type: object
 * properties:
 *   order:
 *     $ref: "#/components/schemas/Order"
 */
export type AdminPostDraftOrdersDraftOrderRegisterPaymentRes = {
  order: Order
}

/**
 * @schema AdminDraftOrdersRes
 * type: object
 * properties:
 *   draft_order:
 *     $ref: "#/components/schemas/DraftOrder"
 */
export type AdminDraftOrdersRes = {
  draft_order: DraftOrder
}

/**
 * @schema AdminDraftOrdersDeleteRes
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Draft Order.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: draft-order
 *   deleted:
 *     type: boolean
 *     description: Whether the draft order was deleted successfully or not.
 *     default: true
 */
export type AdminDraftOrdersDeleteRes = DeleteResponse

/**
 * @schema AdminDraftOrdersListRes
 * type: object
 * properties:
 *   draft_orders:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/DraftOrder"
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
