import { Router } from "express"
import middlewares, { transformQuery } from "../../../middlewares"
import { EmptyQueryParams } from "../../../../types/common"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import OrderEditingFeatureFlag from "../../../../loaders/feature-flags/order-editing"
import {
  defaultOrderEditFields,
  defaultOrderEditRelations,
} from "../../../../types/order-edit"
import { OrderEdit } from "../../../../models"

const route = Router()

export default (app) => {
  app.use(
    "/order-edits",
    isFeatureFlagEnabled(OrderEditingFeatureFlag.key),
    route
  )

  route.get(
    "/:id",
    transformQuery(EmptyQueryParams, {
      defaultRelations: defaultOrderEditRelations.filter(
        (field) => !storeOrderEditNotAllowedFields.includes(field)
      ),
      defaultFields: defaultOrderEditFields.filter(
        (field) => !storeOrderEditNotAllowedFields.includes(field)
      ),
      allowedFields: defaultOrderEditFields,
      isList: false,
    }),
    middlewares.wrap(require("./get-order-edit").default)
  )

  return app
}

export type StoreOrderEditsRes = {
  order_edit: Omit<
    OrderEdit,
    "internal_note" | "created_by" | "confirmed_by" | "canceled_by"
  >
}

export const storeOrderEditNotAllowedFields = [
  "internal_note",
  "created_by",
  "confirmed_by",
  "canceled_by",
]
