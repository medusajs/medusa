import { InventoryItemDTO, InventoryLevelDTO } from "@medusajs/types"
import { Router } from "express"
import "reflect-metadata"
import { ProductVariant } from "../../../../models"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { checkRegisteredModules } from "../../../middlewares/check-registered-modules"
import {
  AdminPostInventoryItemsParams,
  AdminPostInventoryItemsReq,
} from "./create-inventory-item"
import {
  AdminPostInventoryItemsItemLocationLevelsParams,
  AdminPostInventoryItemsItemLocationLevelsReq,
} from "./create-location-level"
import { AdminGetInventoryItemsItemParams } from "./get-inventory-item"
import { AdminGetInventoryItemsParams } from "./list-inventory-items"
import { AdminGetInventoryItemsItemLocationLevelsParams } from "./list-location-levels"
import {
  AdminPostInventoryItemsInventoryItemParams,
  AdminPostInventoryItemsInventoryItemReq,
} from "./update-inventory-item"
import {
  AdminPostInventoryItemsItemLocationLevelsLevelParams,
  AdminPostInventoryItemsItemLocationLevelsLevelReq,
} from "./update-location-level"

const route = Router()

export default (app) => {
  app.use(
    "/inventory-items",
    checkRegisteredModules({
      inventoryService:
        "Inventory is not enabled. Please add an Inventory module to enable this functionality.",
    }),
    route
  )

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
    transformQuery(AdminPostInventoryItemsInventoryItemParams, {
      defaultFields: defaultAdminInventoryItemFields,
      defaultRelations: defaultAdminInventoryItemRelations,
      isList: false,
    }),
    transformBody(AdminPostInventoryItemsInventoryItemReq),
    middlewares.wrap(require("./update-inventory-item").default)
  )

  route.delete(
    "/:id",
    middlewares.wrap(require("./delete-inventory-item").default)
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

  route.post(
    "/",
    transformQuery(AdminPostInventoryItemsParams, {
      defaultFields: defaultAdminInventoryItemFields,
      defaultRelations: defaultAdminInventoryItemRelations,
      isList: false,
    }),
    transformBody(AdminPostInventoryItemsReq),
    middlewares.wrap(require("./create-inventory-item").default)
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

/**
 * @schema AdminInventoryItemsRes
 * type: object
 * required:
 *   - inventory_item
 * properties:
 *   inventory_item:
 *     $ref: "#/components/schemas/InventoryItemDTO"
 */
export type AdminInventoryItemsRes = {
  inventory_item: InventoryItemDTO
}

/**
 * @schema AdminInventoryItemsDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Inventory Item.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     format: inventory_item
 *   deleted:
 *     type: boolean
 *     description: Whether or not the Inventory Item was deleted.
 *     default: true
 */
export type AdminInventoryItemsDeleteRes = DeleteResponse

/**
 * @schema AdminInventoryItemsListRes
 * type: object
 * required:
 *   - inventory_items
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   inventory_items:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/InventoryItemDTO"
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
export type AdminInventoryItemsListRes = PaginatedResponse & {
  inventory_items: InventoryItemDTO[]
}

/**
 * @schema AdminInventoryItemsListWithVariantsAndLocationLevelsRes
 * type: object
 * required:
 *   - inventory_items
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   inventory_items:
 *     type: array
 *     items:
 *       allOf:
 *         - $ref: "#/components/schemas/InventoryItemDTO"
 *         - type: object
 *           properties:
 *             location_levels:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: "#/components/schemas/InventoryLevelDTO"
 *             variants:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: "#/components/schemas/ProductVariant"
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
export type AdminInventoryItemsListWithVariantsAndLocationLevelsRes =
  PaginatedResponse & {
    inventory_items: (Partial<InventoryItemDTO> & {
      location_levels?: InventoryLevelDTO[]
      variants?: ProductVariant[]
    })[]
  }
/**
 * @schema AdminInventoryItemsLocationLevelsRes
 * type: object
 * required:
 *   - inventory_item
 * properties:
 *   inventory_item:
 *     type: object
 *     required:
 *       - id
 *       - location_levels
 *     properties:
 *       id:
 *         description: The id of the location
 *       location_levels:
 *         description: List of stock levels at a given location
 *         type: array
 *         items:
 *           $ref: "#/components/schemas/InventoryLevelDTO"
 */
export type AdminInventoryItemsLocationLevelsRes = {
  inventory_item: {
    id
    location_levels: InventoryLevelDTO[]
  }
}

export * from "./create-inventory-item"
export * from "./create-location-level"
export * from "./get-inventory-item"
export * from "./list-inventory-items"
export * from "./list-location-levels"
export * from "./update-inventory-item"
export * from "./update-location-level"
