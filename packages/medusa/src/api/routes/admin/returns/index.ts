import { Router } from "express"
import "reflect-metadata"
import { Order, Return } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"
import {
  defaultAdminOrdersFields,
  defaultAdminOrdersRelations,
} from "../../../../types/orders"

const route = Router()

export default (app) => {
  app.use("/returns", route)

  /**
   * List returns
   */
  route.get("/", middlewares.wrap(require("./list-returns").default))

  route.post(
    "/:id/receive",
    middlewares.wrap(require("./receive-return").default)
  )

  route.post(
    "/:id/cancel",
    middlewares.wrap(require("./cancel-return").default)
  )

  return app
}

export const defaultRelations = ["swap"]
export const defaultRelationsList = ["swap", "order"]
export const defaultReturnCancelRelations = [...defaultAdminOrdersRelations]
export const defaultReturnCancelFields = [...defaultAdminOrdersFields]

/**
 * @schema AdminReturnsCancelRes
 * type: object
 * x-expanded-relations:
 *   field: order
 *   relations:
 *     - billing_address
 *     - claims
 *     - claims.additional_items
 *     - claims.additional_items.variant
 *     - claims.claim_items
 *     - claims.claim_items.images
 *     - claims.claim_items.item
 *     - claims.fulfillments
 *     - claims.fulfillments.tracking_links
 *     - claims.return_order
 *     - claims.return_order.shipping_method
 *     - claims.return_order.shipping_method.tax_lines
 *     - claims.shipping_address
 *     - claims.shipping_methods
 *     - customer
 *     - discounts
 *     - discounts.rule
 *     - fulfillments
 *     - fulfillments.items
 *     - fulfillments.tracking_links
 *     - gift_card_transactions
 *     - gift_cards
 *     - items
 *     - payments
 *     - refunds
 *     - region
 *     - returns
 *     - returns.items
 *     - returns.items.reason
 *     - returns.shipping_method
 *     - returns.shipping_method.tax_lines
 *     - shipping_address
 *     - shipping_methods
 *     - swaps
 *     - swaps.additional_items
 *     - swaps.additional_items.variant
 *     - swaps.fulfillments
 *     - swaps.fulfillments.tracking_links
 *     - swaps.payment
 *     - swaps.return_order
 *     - swaps.return_order.shipping_method
 *     - swaps.return_order.shipping_method.tax_lines
 *     - swaps.shipping_address
 *     - swaps.shipping_methods
 *     - swaps.shipping_methods.tax_lines
 * required:
 *   - order
 * properties:
 *   order:
 *     $ref: "#/components/schemas/Order"
 */
export type AdminReturnsCancelRes = {
  order: Order
}

/**
 * @schema AdminReturnsListRes
 * type: object
 * x-expanded-relation:
 *   field: returns
 *   relations:
 *     - order
 *     - swap
 * required:
 *   - returns
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   returns:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Return"
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
export type AdminReturnsListRes = PaginatedResponse & {
  returns: Return[]
}

/**
 * @schema AdminReturnsRes
 * type: object
 * x-expanded-relation:
 *   field: return
 *   relations:
 *     - swap
 * required:
 *   - return
 * properties:
 *   return:
 *     $ref: "#/components/schemas/Return"
 */
export type AdminReturnsRes = {
  return: Return
}

export * from "./list-returns"
export * from "./receive-return"
