import { Router } from "express"

import { OrderEdit } from "../../../../models"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import {
  defaultOrderEditFields,
  defaultOrderEditRelations,
} from "../../../../types/order-edit"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { AdminPostOrderEditsEditLineItemsReq } from "./add-line-item"
import { AdminPostOrderEditsReq } from "./create-order-edit"
import { GetOrderEditsOrderEditParams } from "./get-order-edit"
import { GetOrderEditsParams } from "./list-order-edit"
import { AdminPostOrderEditsRequestConfirmationReq } from "./request-confirmation"
import { AdminPostOrderEditsOrderEditReq } from "./update-order-edit"
import { AdminPostOrderEditsEditLineItemsLineItemReq } from "./update-order-edit-line-item"

const route = Router()

export default (app) => {
  app.use("/order-edits", route)

  route.post(
    "/",
    transformBody(AdminPostOrderEditsReq),
    middlewares.wrap(require("./create-order-edit").default)
  )

  route.get(
    "/",
    transformQuery(GetOrderEditsParams, {
      defaultFields: defaultOrderEditFields,
      defaultRelations: defaultOrderEditRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-order-edit").default)
  )

  route.get(
    "/:id",
    transformQuery(GetOrderEditsOrderEditParams, {
      defaultRelations: defaultOrderEditRelations,
      defaultFields: defaultOrderEditFields,
      isList: false,
    }),
    middlewares.wrap(require("./get-order-edit").default)
  )

  route.post(
    "/:id",
    transformBody(AdminPostOrderEditsOrderEditReq),
    middlewares.wrap(require("./update-order-edit").default)
  )

  route.post(
    "/:id/cancel",
    middlewares.wrap(require("./cancel-order-edit").default)
  )

  route.post(
    "/:id/items",
    transformBody(AdminPostOrderEditsEditLineItemsReq),
    middlewares.wrap(require("./add-line-item").default)
  )

  route.post(
    "/:id/confirm",
    middlewares.wrap(require("./confirm-order-edit").default)
  )

  route.delete("/:id", middlewares.wrap(require("./delete-order-edit").default))

  route.delete(
    "/:id/changes/:change_id",
    middlewares.wrap(require("./delete-order-edit-item-change").default)
  )

  route.post(
    "/:id/request",
    transformBody(AdminPostOrderEditsRequestConfirmationReq),
    middlewares.wrap(require("./request-confirmation").default)
  )

  route.post(
    "/:id/items/:item_id",
    transformBody(AdminPostOrderEditsEditLineItemsLineItemReq),
    middlewares.wrap(require("./update-order-edit-line-item").default)
  )

  route.delete(
    "/:id/items/:item_id",
    middlewares.wrap(require("./delete-line-item").default)
  )

  return app
}

/**
 * @schema AdminOrderEditsRes
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
export type AdminOrderEditsRes = {
  order_edit: OrderEdit
}

/**
 * @schema AdminOrderEditsListRes
 * type: object
 * x-expanded-relations:
 *   field: order_edits
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
 *   - order_edits
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   order_edits:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/OrderEdit"
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
export type AdminOrderEditsListRes = PaginatedResponse & {
  order_edits: OrderEdit[]
}

/**
 * @schema AdminOrderEditDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Order Edit.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: order_edit
 *   deleted:
 *     type: boolean
 *     description: Whether or not the Order Edit was deleted.
 *     default: true
 */
export type AdminOrderEditDeleteRes = DeleteResponse

/**
 * @schema AdminOrderEditItemChangeDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Order Edit Item Change.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: item_change
 *   deleted:
 *     type: boolean
 *     description: Whether or not the Order Edit Item Change was deleted.
 *     default: true
 */
export type AdminOrderEditItemChangeDeleteRes = {
  id: string
  object: "item_change"
  deleted: boolean
}

export * from "./add-line-item"
export * from "./create-order-edit"
export * from "./get-order-edit"
export * from "./list-order-edit"
export * from "./request-confirmation"
export * from "./update-order-edit"
export * from "./update-order-edit-line-item"
