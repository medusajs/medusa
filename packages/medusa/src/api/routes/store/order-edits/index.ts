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
