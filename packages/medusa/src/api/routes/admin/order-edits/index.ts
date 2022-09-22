import { Router } from "express"

import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { DeleteResponse, EmptyQueryParams } from "../../../../types/common"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import OrderEditingFeatureFlag from "../../../../loaders/feature-flags/order-editing"
import {
  defaultOrderEditFields,
  defaultOrderEditRelations,
} from "../../../../types/order-edit"
import { OrderEdit } from "../../../../models"
import { AdminPostOrderEditsOrderEditReq } from "./update-order-edit"
import { AdminPostOrderEditsReq } from "./create-order-edit"

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
    "/:id",
    transformQuery(EmptyQueryParams, {
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

  route.delete("/:id", middlewares.wrap(require("./delete-order-edit").default))

  route.delete(
    "/:id/changes/:change_id",
    middlewares.wrap(require("./delete-order-edit-item-change").default)
  )

  return app
}

export type AdminOrderEditsRes = {
  order_edit: OrderEdit
}
export type AdminOrderEditDeleteRes = DeleteResponse
export type AdminOrderEditItemChangeDeleteRes = {
  id: string
  object: "item_change"
  deleted: boolean
}

export * from "./update-order-edit"
export * from "./create-order-edit"
