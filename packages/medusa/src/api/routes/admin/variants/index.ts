import { Router } from "express"

import { PaginatedResponse } from "../../../../types/common"
import { ProductVariant } from "../../../../models/product-variant"

const route = Router()

export default (app) => {
  app.use("/variants", route)

  route.get("/", require("./list-variants").default)

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

export const allowedAdminVariantFields = [
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

export const allowedAdminVariantRelations: (keyof ProductVariant)[] = [
  "product",
  "prices",
  "options",
]

export type AdminVariantsListRes = PaginatedResponse & {
  variants: ProductVariant[]
}

export * from "./list-variants"
