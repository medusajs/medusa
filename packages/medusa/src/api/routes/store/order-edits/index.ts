import { Router } from "express"
import { OrderEdit } from "../../../../models"
import { FindParams } from "../../../../types/common"
import {
  defaultStoreOrderEditFields,
  defaultStoreOrderEditRelations,
} from "../../../../types/order-edit"
import middlewares, {
  transformBody,
  transformStoreQuery,
} from "../../../middlewares"
import { StorePostOrderEditsOrderEditDecline } from "./decline-order-edit"

const route = Router()

export default (app) => {
  app.use("/order-edits", route)

  route.get(
    "/:id",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreOrderEditRelations,
      defaultFields: defaultStoreOrderEditFields,
      allowedFields: defaultStoreOrderEditFields,
      isList: false,
    }),
    middlewares.wrap(require("./get-order-edit").default)
  )

  route.post(
    "/:id/decline",
    transformBody(StorePostOrderEditsOrderEditDecline),
    middlewares.wrap(require("./decline-order-edit").default)
  )

  route.post(
    "/:id/complete",
    middlewares.wrap(require("./complete-order-edit").default)
  )

  return app
}

/**
 * @schema StoreOrderEditsRes
 * type: object
 * x-expanded-relations:
 *   field: order_edit
 *   relations:
 *     - changes
 *     - changes.line_item
 *     - changes.line_item.variant
 *     - changes.original_line_item
 *     - changes.original_line_item.variant
 *     - items
 *     - items.adjustments
 *     - items.tax_lines
 *     - items.variant
 *     - payment_collection
 *   implicit:
 *     - items
 *     - items.tax_lines
 *     - items.adjustments
 *     - items.variant
 *   totals:
 *     - difference_due
 *     - discount_total
 *     - gift_card_tax_total
 *     - gift_card_total
 *     - shipping_total
 *     - subtotal
 *     - tax_total
 *     - total
 *     - items.discount_total
 *     - items.gift_card_total
 *     - items.original_tax_total
 *     - items.original_total
 *     - items.refundable
 *     - items.subtotal
 *     - items.tax_total
 *     - items.total
 * required:
 *   - order_edit
 * properties:
 *   order_edit:
 *     $ref: "#/components/schemas/OrderEdit"
 */
export type StoreOrderEditsRes = {
  order_edit: Omit<
    OrderEdit,
    "internal_note" | "created_by" | "confirmed_by" | "canceled_by"
  >
}

export * from "./decline-order-edit"
