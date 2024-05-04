import { Router } from "express"
import { Cart, DraftOrder, Order } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, { transformQuery } from "../../../middlewares"
import { AdminGetDraftOrdersParams } from "./list-draft-orders"

const route = Router()

export default (app) => {
  app.use("/draft-orders", route)

  route.get(
    "/",
    transformQuery(AdminGetDraftOrdersParams, {
      defaultFields: defaultAdminDraftOrdersFields,
      defaultRelations: defaultAdminDraftOrdersRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-draft-orders").default)
  )

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
  "shipping_address.country",
  "billing_address",
  "billing_address.country",
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
 * description: "The order's details."
 * required:
 *   - order
 * properties:
 *   order:
 *     description: Order's details.
 *     $ref: "#/components/schemas/Order"
 */
export type AdminPostDraftOrdersDraftOrderRegisterPaymentRes = {
  order: Order
}
/**
 * @schema AdminDraftOrdersRes
 * type: object
 * description: "The list of draft orders."
 * x-expanded-relations:
 *   field: draft_order
 *   relations:
 *     - order
 *     - cart
 *     - cart.items
 *     - cart.items.adjustments
 *     - cart.billing_address
 *     - cart.customer
 *     - cart.discounts
 *     - cart.discounts.rule
 *     - cart.items
 *     - cart.items.adjustments
 *     - cart.payment
 *     - cart.payment_sessions
 *     - cart.region
 *     - cart.region.payment_providers
 *     - cart.shipping_address
 *     - cart.shipping_methods
 *     - cart.shipping_methods.shipping_option
 *   eager:
 *     - cart.region.fulfillment_providers
 *     - cart.region.payment_providers
 *     - cart.shipping_methods.shipping_option
 *   implicit:
 *     - cart.discounts
 *     - cart.discounts.rule
 *     - cart.gift_cards
 *     - cart.items
 *     - cart.items.adjustments
 *     - cart.items.tax_lines
 *     - cart.items.variant
 *     - cart.items.variant.product
 *     - cart.items.variant.product.profiles
 *     - cart.region
 *     - cart.region.tax_rates
 *     - cart.shipping_address
 *     - cart.shipping_methods
 *     - cart.shipping_methods.tax_lines
 *   totals:
 *     - cart.discount_total
 *     - cart.gift_card_tax_total
 *     - cart.gift_card_total
 *     - cart.item_tax_total
 *     - cart.refundable_amount
 *     - cart.refunded_total
 *     - cart.shipping_tax_total
 *     - cart.shipping_total
 *     - cart.subtotal
 *     - cart.tax_total
 *     - cart.total
 *     - cart.items.discount_total
 *     - cart.items.gift_card_total
 *     - cart.items.original_tax_total
 *     - cart.items.original_total
 *     - cart.items.refundable
 *     - cart.items.subtotal
 *     - cart.items.tax_total
 *     - cart.items.total
 * required:
 *   - draft_order
 * properties:
 *   draft_order:
 *     description: Draft order's details.
 *     $ref: "#/components/schemas/DraftOrder"
 */
export type AdminDraftOrdersRes = {
  draft_order: DraftOrder
}

/**
 * @schema AdminDraftOrdersDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
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
 *     description: Whether the draft order was deleted successfully.
 *     default: true
 */
export type AdminDraftOrdersDeleteRes = DeleteResponse

/**
 * @schema AdminDraftOrdersListRes
 * description: "The list of draft orders with pagination fields."
 * type: object
 * x-expanded-relations:
 *   field: draft_orders
 *   relations:
 *     - order
 *     - cart
 *     - cart.items
 *     - cart.items.adjustments
 * required:
 *   - draft_orders
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   draft_orders:
 *     type: array
 *     description: An array of draft order's details.
 *     items:
 *       $ref: "#/components/schemas/DraftOrder"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of draft orders skipped when retrieving the draft orders.
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
