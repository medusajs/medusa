import { Router } from "express"

import { ProductVariant } from "../../../../models/product-variant"
import { PaginatedResponse } from "../../../../types/common"
import { PricedVariant } from "../../../../types/pricing"
import middlewares, { transformQuery } from "../../../middlewares"
import { checkRegisteredModules } from "../../../middlewares/check-registered-modules"
import { AdminGetVariantParams } from "./get-variant"
import { AdminGetVariantsParams } from "./list-variants"

const route = Router()

export default (app) => {
  app.use("/variants", route)

  route.get(
    "/",
    transformQuery(AdminGetVariantsParams, {
      defaultRelations: defaultAdminVariantRelations,
      defaultFields: defaultAdminVariantFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-variants").default)
  )

  route.get(
    "/:id",
    transformQuery(AdminGetVariantParams, {
      defaultRelations: defaultAdminVariantRelations,
      defaultFields: defaultAdminVariantFields,
      isList: false,
    }),
    middlewares.wrap(require("./get-variant").default)
  )

  route.get(
    "/:id/inventory",
    checkRegisteredModules({
      inventoryService:
        "Inventory is not enabled. Please add an Inventory module to enable this functionality.",
    }),
    middlewares.wrap(require("./get-inventory").default)
  )

  return app
}

export const defaultAdminVariantRelations = ["product", "prices", "options"]

export const defaultAdminVariantFields: (keyof ProductVariant)[] = [
  "id",
  "title",
  "product_id",
  "sku",
  "barcode",
  "ean",
  "upc",
  "inventory_quantity",
  "allow_backorder",
  "weight",
  "length",
  "height",
  "width",
  "hs_code",
  "origin_country",
  "mid_code",
  "material",
  "created_at",
  "updated_at",
  "metadata",
  "deleted_at",
  "manage_inventory",
]

/**
 * @schema AdminVariantsListRes
 * type: object
 * x-expanded-relations:
 *   field: variants
 *   relations:
 *     - options
 *     - prices
 *     - product
 * required:
 *   - variants
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   variants:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/PricedVariant"
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
export type AdminVariantsListRes = PaginatedResponse & {
  variants: PricedVariant[]
}

/**
 * @schema AdminVariantsRes
 * type: object
 * x-expanded-relations:
 *   field: variant
 *   relations:
 *     - options
 *     - prices
 *     - product
 * required:
 *   - variant
 * properties:
 *   variant:
 *     $ref: "#/components/schemas/PricedVariant"
 */
export type AdminVariantsRes = {
  variant: PricedVariant
}

export * from "./list-variants"
export * from "./get-variant"
export * from "./get-inventory"
