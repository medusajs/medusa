import { Router } from "express"

import { ProductVariant } from "../../../../models/product-variant"
import { PaginatedResponse } from "../../../../types/common"
import { PricedVariant } from "../../../../types/pricing"
import middlewares, { transformQuery } from "../../../middlewares"
import { checkRegisteredModules } from "../../../middlewares/check-registered-modules"
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
]

/**
 * @schema AdminVariantsListRes
 * type: object
 * properties:
 *   variants:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ProductVariant"
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

export * from "./list-variants"
export * from "./get-inventory"
