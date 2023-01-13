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

export type AdminOrderEditsRes = {
  order_edit: OrderEdit
}
export type AdminOrderEditsListRes = PaginatedResponse & {
  order_edits: OrderEdit[]
}
export type AdminOrderEditDeleteRes = DeleteResponse
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
