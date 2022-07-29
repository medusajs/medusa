import { Router } from "express"
import "reflect-metadata"
import { Product, ProductTag, ProductType } from "../../../.."
import { EmptyQueryParams, PaginatedResponse } from "../../../../types/common"
import { PricedProduct } from "../../../../types/pricing"
import { FlagRouter } from "../../../../utils/flag-router"
import middlewares, { transformQuery } from "../../../middlewares"
import { validateSalesChannelsExist } from "../../../middlewares/validators/sales-channel-existence"
import { AdminGetProductsParams } from "./list-products"

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  app.use("/products", route)

  if (featureFlagRouter.isFeatureEnabled("sales_channels")) {
    defaultAdminProductRelations.push("sales_channels")
  }

  route.post(
    "/",
    validateSalesChannelsExist((req) => req.body?.sales_channels),
    require("./create-product").default
  )
  route.post(
    "/:id",
    validateSalesChannelsExist((req) => req.body?.sales_channels),
    require("./update-product").default
  )
  route.get("/types", require("./list-types").default)
  route.get("/tag-usage", require("./list-tag-usage-count").default)

  route.get(
    "/:id/variants",
    middlewares.normalizeQuery(),
    require("./list-variants").default
  )
  route.post("/:id/variants", require("./create-variant").default)

  route.post("/:id/variants/:variant_id", require("./update-variant").default)

  route.post("/:id/options/:option_id", require("./update-option").default)
  route.post("/:id/options", require("./add-option").default)

  route.delete("/:id/variants/:variant_id", require("./delete-variant").default)
  route.delete("/:id", require("./delete-product").default)
  route.delete("/:id/options/:option_id", require("./delete-option").default)

  route.post("/:id/metadata", require("./set-metadata").default)
  route.get(
    "/:id",
    transformQuery(EmptyQueryParams, {
      defaultRelations: defaultAdminProductRelations,
      defaultFields: defaultAdminProductFields,
      allowedFields: allowedAdminProductFields,
      isList: false,
    }),
    require("./get-product").default
  )

  route.get(
    "/",
    transformQuery(AdminGetProductsParams, {
      defaultRelations: defaultAdminProductRelations,
      defaultFields: defaultAdminProductFields,
      allowedFields: allowedAdminProductFields,
      isList: true,
    }),
    require("./list-products").default
  )

  return app
}

export const defaultAdminProductRelations = [
  "variants",
  "variants.prices",
  "variants.options",
  "images",
  "options",
  "tags",
  "type",
  "collection",
]

export const defaultAdminProductFields: (keyof Product)[] = [
  "id",
  "title",
  "subtitle",
  "status",
  "external_id",
  "description",
  "handle",
  "is_giftcard",
  "discountable",
  "thumbnail",
  "profile_id",
  "collection_id",
  "type_id",
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
  "deleted_at",
  "metadata",
]

export const defaultAdminGetProductsVariantsFields = ["id", "product_id"]

export const allowedAdminProductFields = [
  "id",
  "title",
  "subtitle",
  "status",
  "external_id",
  "description",
  "handle",
  "is_giftcard",
  "discountable",
  "thumbnail",
  "profile_id",
  "collection_id",
  "type_id",
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
  "deleted_at",
  "metadata",
]

export const allowedAdminProductRelations = [
  "variants",
  "variants.prices",
  "images",
  "options",
  "tags",
  "type",
  "collection",
  "sales_channels",
]

export type AdminProductsDeleteOptionRes = {
  option_id: string
  object: "option"
  deleted: boolean
  product: Product
}

export type AdminProductsDeleteVariantRes = {
  variant_id: string
  object: "product-variant"
  deleted: boolean
  product: Product
}

export type AdminProductsDeleteRes = {
  id: string
  object: "product"
  deleted: boolean
}

export type AdminProductsListRes = PaginatedResponse & {
  products: (PricedProduct | Product)[]
}

export type AdminProductsListTypesRes = {
  types: ProductType[]
}

export type AdminProductsListTagsRes = {
  tags: ProductTag[]
}

export type AdminProductsRes = {
  product: Product
}

export * from "./add-option"
export * from "./create-product"
export * from "./create-variant"
export * from "./delete-option"
export * from "./delete-product"
export * from "./delete-variant"
export * from "./get-product"
export * from "./list-products"
export * from "./list-tag-usage-count"
export * from "./list-types"
export * from "./list-variants"
export * from "./set-metadata"
export * from "./update-option"
export * from "./update-product"
export * from "./update-variant"
