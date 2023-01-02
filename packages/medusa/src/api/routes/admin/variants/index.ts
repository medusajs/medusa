import { Router } from "express"

import { ProductVariant } from "../../../../models/product-variant"
import { PaginatedResponse } from "../../../../types/common"
import { PricedVariant } from "../../../../types/pricing"
import middlewares, { transformQuery } from "../../../middlewares"
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

export type AdminVariantsListRes = PaginatedResponse & {
  variants: PricedVariant[]
}

export * from "./list-variants"
