import { Router } from "express"

import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import OrderEditingFeatureFlag from "../../../../loaders/feature-flags/order-editing"
import {
  defaultOrderEditFields,
  defaultOrderEditRelations,
} from "../../../../types/order-edit"
import { OrderEdit } from "../../../../models"
import { AdminPostOrderEditsOrderEditReq } from "./update-order-edit"
import { AdminPostOrderEditsReq } from "./create-order-edit"
import { AdminPostOrderEditsEditLineItemsReq } from "./add-line-item"
import { AdminPostOrderEditsEditLineItemsLineItemReq } from "./update-order-edit-line-item"
import { GetOrderEditsParams } from "./list-order-edit"
import { GetOrderEditsOrderEditParams } from "./get-order-edit"

const route = Router()

export default (app) => {
  app.use(
    "/order-edits",
    isFeatureFlagEnabled(OrderEditingFeatureFlag.key),
    route
  )

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

export * from "./update-order-edit"
export * from "./update-order-edit-line-item"
export * from "./create-order-edit"
export * from "./get-order-edit"
export * from "./list-order-edit"
export * from "./add-line-item"
