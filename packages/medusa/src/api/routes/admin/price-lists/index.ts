import "reflect-metadata"

import { PriceList, Product } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import {
  defaultAdminProductFields,
  defaultAdminProductRelations,
} from "../products"

import { FlagRouter } from "@medusajs/utils"
import { Router } from "express"
import TaxInclusivePricingFeatureFlag from "../../../../loaders/feature-flags/tax-inclusive-pricing"
import { AdminPostPriceListsPriceListReq } from "./create-price-list"
import { AdminGetPriceListsPriceListProductsParams } from "./list-price-list-products"
import { AdminGetPriceListPaginationParams } from "./list-price-lists"

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  app.use("/price-lists", route)

  if (featureFlagRouter.isFeatureEnabled(TaxInclusivePricingFeatureFlag.key)) {
    defaultAdminPriceListFields.push("includes_tax")
  }

  route.get("/:id", middlewares.wrap(require("./get-price-list").default))

  route.get(
    "/",
    transformQuery(AdminGetPriceListPaginationParams, { isList: true }),
    middlewares.wrap(require("./list-price-lists").default)
  )

  route.get(
    "/:id/products",
    transformQuery(AdminGetPriceListsPriceListProductsParams, {
      defaultFields: defaultAdminProductFields,
      defaultRelations: defaultAdminProductRelations.filter(
        (r) => r !== "variants.prices"
      ),
      defaultLimit: 50,
      isList: true,
    }),
    middlewares.wrap(require("./list-price-list-products").default)
  )

  route.delete(
    "/:id/products/:product_id/prices",
    middlewares.wrap(require("./delete-product-prices").default)
  )

  route.delete(
    "/:id/products/prices/batch",
    middlewares.wrap(require("./delete-products-prices-batch").default)
  )

  route.delete(
    "/:id/variants/:variant_id/prices",
    middlewares.wrap(require("./delete-variant-prices").default)
  )

  route.post(
    "/",
    transformBody(AdminPostPriceListsPriceListReq),
    middlewares.wrap(require("./create-price-list").default)
  )

  route.post("/:id", middlewares.wrap(require("./update-price-list").default))

  route.delete("/:id", middlewares.wrap(require("./delete-price-list").default))

  route.delete(
    "/:id/prices/batch",
    middlewares.wrap(require("./delete-prices-batch").default)
  )

  route.post(
    "/:id/prices/batch",
    middlewares.wrap(require("./add-prices-batch").default)
  )

  return app
}

export const defaultAdminPriceListFields = [
  "id",
  "name",
  "description",
  "type",
  "status",
  "starts_at",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultAdminPriceListRelations = [
  "prices",
  "prices.variants",
  "customer_groups",
]

/**
 * @schema AdminPriceListRes
 * type: object
 * description: "The price list's details."
 * x-expanded-relations:
 *   field: price_list
 *   relations:
 *     - customer_groups
 *     - prices
 * required:
 *   - price_list
 * properties:
 *   price_list:
 *     description: "Price List details."
 *     $ref: "#/components/schemas/PriceList"
 */
export type AdminPriceListRes = {
  price_list: PriceList
}

/**
 * @schema AdminPriceListDeleteBatchRes
 * type: object
 * description: "The details of deleting a price list."
 * required:
 *   - ids
 *   - object
 *   - deleted
 * properties:
 *   ids:
 *     type: array
 *     description: The IDs of the deleted prices.
 *     items:
 *       type: string
 *       description: The ID of a deleted price.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted. A price is also named `money-amount`.
 *     default: money-amount
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminPriceListDeleteBatchRes = {
  ids: string[]
  deleted: boolean
  object: string
}

/**
 * @schema AdminPriceListDeleteProductPricesRes
 * type: object
 * required:
 *   - ids
 *   - object
 *   - deleted
 * properties:
 *    ids:
 *     type: array
 *     description: The IDs of the deleted prices.
 *     items:
 *       type: string
 *    object:
 *      type: string
 *      description: The type of the object that was deleted. A price is also named `money-amount`.
 *      default: money-amount
 *    deleted:
 *      type: boolean
 *      description: Whether or not the items were deleted.
 *      default: true
 */
export type AdminPriceListDeleteProductPricesRes = AdminPriceListDeleteBatchRes

/**
 * @schema AdminPriceListDeleteVariantPricesRes
 * type: object
 * required:
 *   - ids
 *   - object
 *   - deleted
 * properties:
 *    ids:
 *     type: array
 *     description: The IDs of the deleted prices.
 *     items:
 *       type: string
 *    object:
 *      type: string
 *      description: The type of the object that was deleted. A price is also named `money-amount`.
 *      default: money-amount
 *    deleted:
 *      type: boolean
 *      description: Whether or not the items were deleted.
 *      default: true
 */
export type AdminPriceListDeleteVariantPricesRes = AdminPriceListDeleteBatchRes

/**
 * @schema AdminPriceListDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Price List.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: price-list
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminPriceListDeleteRes = DeleteResponse

/**
 * @schema AdminPriceListsListRes
 * type: object
 * description: "The list of price lists with pagination fields."
 * required:
 *   - price_lists
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   price_lists:
 *    type: array
 *    description: "An array of price lists details."
 *    items:
 *      $ref: "#/components/schemas/PriceList"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of price lists skipped when retrieving the price lists.
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminPriceListsListRes = PaginatedResponse & {
  price_lists: PriceList[]
}

/**
 * @schema AdminPriceListsProductsListRes
 * type: object
 * description: "The list of products with pagination fields."
 * x-expanded-relations:
 *   field: products
 *   relations:
 *     - categories
 *     - collection
 *     - images
 *     - options
 *     - tags
 *     - type
 *     - variants
 *     - variants.options
 * required:
 *   - products
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   products:
 *     type: array
 *     description: "An array of products details."
 *     items:
 *       $ref: "#/components/schemas/Product"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of price lists skipped when retrieving the price lists.
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminPriceListsProductsListRes = PaginatedResponse & {
  products: Product[]
}

export * from "./add-prices-batch"
export * from "./create-price-list"
export * from "./delete-price-list"
export * from "./delete-prices-batch"
export * from "./delete-products-prices-batch"
export * from "./get-price-list"
export * from "./list-price-list-products"
export * from "./list-price-lists"
export * from "./update-price-list"
