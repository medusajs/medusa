import { Router } from "express"
import "reflect-metadata"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import { InventoryItemDTO } from "../../../../types/inventory"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { AdminGetInventoryItemsParams } from "./list-inventory-items"
import { AdminGetInventoryItemsItemParams } from "./get-inventory-item"
import { AdminPostInventoryItemsItemReq } from "./update-inventory-item"
import { AdminGetInventoryItemsItemLocationLevelsParams } from "./list-location-levels"
import {
  AdminPostInventoryItemsItemLocationLevelsReq,
  AdminPostInventoryItemsItemLocationLevelsParams,
} from "./create-location-level"
import {
  AdminPostInventoryItemsItemLocationLevelsLevelReq,
  AdminPostInventoryItemsItemLocationLevelsLevelParams,
} from "./update-location-level"

const route = Router()

export default (app) => {
  app.use("/inventory-items", route)

  route.get(
    "/",
    transformQuery(AdminGetInventoryItemsParams, {
      defaultFields: defaultAdminInventoryItemFields,
      defaultRelations: defaultAdminInventoryItemRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-inventory-items").default)
  )

  route.post(
    "/:id",
    transformQuery(AdminGetInventoryItemsItemParams, {
      defaultFields: defaultAdminInventoryItemFields,
      defaultRelations: defaultAdminInventoryItemRelations,
      isList: false,
    }),
    transformBody(AdminPostInventoryItemsItemReq),
    middlewares.wrap(require("./update-inventory-item").default)
  )

  route.post(
    "/:id/location-levels",
    transformQuery(AdminPostInventoryItemsItemLocationLevelsParams, {
      defaultFields: defaultAdminInventoryItemFields,
      defaultRelations: defaultAdminInventoryItemRelations,
      isList: false,
    }),
    transformBody(AdminPostInventoryItemsItemLocationLevelsReq),
    middlewares.wrap(require("./create-location-level").default)
  )

  route.get(
    "/:id/location-levels",
    transformQuery(AdminGetInventoryItemsItemLocationLevelsParams, {
      defaultFields: defaultAdminInventoryItemFields,
      defaultRelations: defaultAdminInventoryItemRelations,
      isList: false,
    }),
    middlewares.wrap(require("./list-location-levels").default)
  )

  route.delete(
    "/:id/location-levels/:location_id",
    middlewares.wrap(require("./delete-location-level").default)
  )

  route.post(
    "/:id/location-levels/:location_id",
    transformQuery(AdminPostInventoryItemsItemLocationLevelsLevelParams, {
      defaultFields: defaultAdminInventoryItemFields,
      defaultRelations: defaultAdminInventoryItemRelations,
      isList: false,
    }),
    transformBody(AdminPostInventoryItemsItemLocationLevelsLevelReq),
    middlewares.wrap(require("./update-location-level").default)
  )

  route.get(
    "/:id",
    transformQuery(AdminGetInventoryItemsItemParams, {
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
  inventory_items: InventoryItemDTO[]
}

export * from "./list-inventory-items"
export * from "./get-inventory-item"
export * from "./update-inventory-item"
export * from "./list-location-levels"
export * from "./create-location-level"
export * from "./update-location-level"
