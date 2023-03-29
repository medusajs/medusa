import { RequestHandler, Router } from "express"
import "reflect-metadata"

import { Product } from "../../../.."
import middlewares, { transformStoreQuery } from "../../../middlewares"
import { FlagRouter } from "../../../../utils/flag-router"
import { PaginatedResponse } from "../../../../types/common"
import { extendRequestParams } from "../../../middlewares/publishable-api-key/extend-request-params"
import PublishableAPIKeysFeatureFlag from "../../../../loaders/feature-flags/publishable-api-keys"
import { validateProductSalesChannelAssociation } from "../../../middlewares/publishable-api-key/validate-product-sales-channel-association"
import { validateSalesChannelParam } from "../../../middlewares/publishable-api-key/validate-sales-channel-param"
import { StoreGetProductsParams } from "./list-products"
import { StoreGetProductsProductParams } from "./get-product"

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  app.use("/products", route)

  if (featureFlagRouter.isFeatureEnabled(PublishableAPIKeysFeatureFlag.key)) {
    route.use(
      "/",
      extendRequestParams as unknown as RequestHandler,
      validateSalesChannelParam as unknown as RequestHandler
    )
    route.use("/:id", validateProductSalesChannelAssociation)
  }

  route.get(
    "/",
    transformStoreQuery(StoreGetProductsParams, {
      defaultRelations: defaultStoreProductsRelations,
      defaultFields: defaultStoreProductsFields,
      allowedFields: allowedStoreProductsFields,
      allowedRelations: allowedStoreProductsRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-products").default)
  )

  route.get(
    "/:id",
    transformStoreQuery(StoreGetProductsProductParams, {
      defaultRelations: defaultStoreProductsRelations,
      defaultFields: defaultStoreProductsFields,
      allowedFields: allowedStoreProductsFields,
      allowedRelations: allowedStoreProductsRelations,
    }),
    middlewares.wrap(require("./get-product").default)
  )

  route.post("/search", middlewares.wrap(require("./search").default))

  return app
}

export const defaultStoreProductsRelations = [
  "variants",
  "variants.prices",
  "variants.options",
  "options",
  "options.values",
  "images",
  "tags",
  "collection",
  "type",
]

export const defaultStoreProductsFields: (keyof Product)[] = [
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

export const allowedStoreProductsFields = [
  ...defaultStoreProductsFields,
  // TODO: order prop validation
  "variants.title",
  "variants.prices.amount",
]

export const allowedStoreProductsRelations = [
  ...defaultStoreProductsRelations,
  "variants.title",
  "variants.prices.amount",
]

export * from "./list-products"
export * from "./search"

/**
 * @schema StoreProductsRes
 * type: object
 * properties:
 *   product:
 *     $ref: "#/components/schemas/PricedProduct"
 */
export type StoreProductsRes = {
  product: Product
}

/**
 * @schema StorePostSearchRes
 * type: object
 * properties:
 *   hits:
 *     type: array
 *     description: Array of results. The format of the items depends on the search engine installed on the server.
 */
export type StorePostSearchRes = {
  hits: unknown[]
  [k: string]: unknown
}

/**
 * @schema StoreProductsListRes
 * type: object
 * properties:
 *   products:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/PricedProduct"
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
export type StoreProductsListRes = PaginatedResponse & {
  products: Product[]
}
