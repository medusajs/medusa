import { Router } from "express"
import "reflect-metadata"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import { InventoryItemDTO } from "../../../../types/inventory"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { AdminGetInventoryItemParams } from "./list-inventory-items"
import { AdminPostInventoryItemsInventoryItemReq } from "./update-inventory-item"

const route = Router()

export default (app) => {
  app.use("/inventory-items", route)

  route.get(
    "/",
    transformQuery(AdminGetInventoryItemParams, {
      defaultFields: defaultAdminInventoryItemFields,
      defaultRelations: defaultAdminInventoryItemRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-inventory-items").default)
  )

  route.post(
    "/:id",
    transformQuery(AdminGetInventoryItemParams, {
      defaultFields: defaultAdminInventoryItemFields,
      defaultRelations: defaultAdminInventoryItemRelations,
      isList: false,
    }),
    transformBody(AdminPostInventoryItemsInventoryItemReq),
    middlewares.wrap(require("./update-inventory-item").default)
  )

  route.get(
    "/:id",
    transformQuery(AdminGetInventoryItemParams, {
      defaultFields: defaultAdminInventoryItemFields,
      defaultRelations: defaultAdminInventoryItemRelations,
      isList: false,
    }),
    middlewares.wrap(require("./get-inventory-item").default)
  )

  return app
}

export const defaultAdminInventoryItemFields: (keyof InventoryItemDTO)[] = [
  "id",
  "sku",
  "origin_country",
  "hs_code",
  "requires_shipping",
  "mid_code",
  "material",
  "weight",
  "length",
  "height",
  "width",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminInventoryItemRelations = []

export type AdminInventoryItemsRes = {
  inventory_item: InventoryItemDTO
}

export type AdminInventoryItemsDeleteRes = DeleteResponse

export type AdminInventoryItemsListRes = PaginatedResponse & {
  inventory_item: InventoryItemDTO[]
}

export * from "./list-inventory-items"
