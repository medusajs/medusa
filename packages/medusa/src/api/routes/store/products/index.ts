import "reflect-metadata"

import middlewares, { transformStoreQuery } from "../../../middlewares"

import { FlagRouter } from "@medusajs/utils"
import { Router } from "express"
import { Product } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import { PricedProduct } from "../../../../types/pricing"
import { extendRequestParams } from "../../../middlewares/publishable-api-key/extend-request-params"
import { validateProductSalesChannelAssociation } from "../../../middlewares/publishable-api-key/validate-product-sales-channel-association"
import { validateSalesChannelParam } from "../../../middlewares/publishable-api-key/validate-sales-channel-param"
import { withDefaultSalesChannel } from "../../../middlewares/with-default-sales-channel"
import { StoreGetProductsProductParams } from "./get-product"
import { StoreGetProductsParams } from "./list-products"

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  if (featureFlagRouter.isFeatureEnabled("product_categories")) {
    allowedStoreProductsRelations.push("categories")
  }

  app.use("/products", extendRequestParams, validateSalesChannelParam, route)

  route.use("/:id", validateProductSalesChannelAssociation)

  route.get(
    "/",
    withDefaultSalesChannel({ attachChannelAsArray: true }),
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
    withDefaultSalesChannel(),
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
  "profiles",
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
  // profile_id is not a column in the products table, so it should be ignored as it
  // will be rejected by typeorm as invalid, though, it is an entity property
  // that we want to return, so it part of the allowedStoreProductsFields
  "profile_id",
  "variants.title",
  "variants.prices.amount",
]

export const allowedStoreProductsRelations = [
  ...defaultStoreProductsRelations,
  "variants.inventory_items",
  "sales_channels",
]

/**
 * This is temporary.
 */
export const defaultStoreProductRemoteQueryObject = {
  fields: defaultStoreProductsFields,
  images: {
    fields: ["id", "created_at", "updated_at", "deleted_at", "url", "metadata"],
  },
  tags: {
    fields: ["id", "created_at", "updated_at", "deleted_at", "value"],
  },

  type: {
    fields: ["id", "created_at", "updated_at", "deleted_at", "value"],
  },

  collection: {
    fields: ["title", "handle", "id", "created_at", "updated_at", "deleted_at"],
  },

  options: {
    fields: [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "title",
      "product_id",
      "metadata",
    ],
    values: {
      fields: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "value",
        "option_id",
        "variant_id",
        "metadata",
      ],
    },
  },

  variants: {
    fields: [
      "id",
      "created_at",
      "updated_at",
      "deleted_at",
      "title",
      "product_id",
      "sku",
      "barcode",
      "ean",
      "upc",
      "variant_rank",
      "inventory_quantity",
      "allow_backorder",
      "manage_inventory",
      "hs_code",
      "origin_country",
      "mid_code",
      "material",
      "weight",
      "length",
      "height",
      "width",
      "metadata",
    ],

    options: {
      fields: [
        "id",
        "created_at",
        "updated_at",
        "deleted_at",
        "value",
        "option_id",
        "variant_id",
        "metadata",
      ],
    },
  },
  profile: {
    fields: ["id", "created_at", "updated_at", "deleted_at", "name", "type"],
  },
  sales_channels: {
    fields: [
      "id",
      "name",
      "description",
      "is_disabled",
      "created_at",
      "updated_at",
      "deleted_at",
      "metadata",
    ],
  },
}

export * from "./list-products"
export * from "./search"

/**
 * @schema StoreProductsRes
 * type: object
 * x-expanded-relations:
 *   field: product
 *   relations:
 *     - collection
 *     - images
 *     - options
 *     - options.values
 *     - tags
 *     - type
 *     - variants
 *     - variants.options
 *     - variants.prices
 *   totals:
 *     - variants.purchasable
 * required:
 *   - product
 * properties:
 *   product:
 *     description: "Product details."
 *     $ref: "#/components/schemas/PricedProduct"
 */
export type StoreProductsRes = {
  product: PricedProduct
}

/**
 * @schema StorePostSearchRes
 * description: "The list of search results."
 * allOf:
 *   - type: object
 *     required:
 *       - hits
 *     properties:
 *       hits:
 *         description: "Array of search results. The format of the items depends on the search engine installed on the Medusa backend."
 *         type: array
 *   - type: object
 */
export type StorePostSearchRes = {
  hits: unknown[]
} & Record<string, unknown>

/**
 * @schema StoreProductsListRes
 * type: object
 * description: "The list of products with pagination fields."
 * x-expanded-relations:
 *   field: products
 *   relations:
 *     - collection
 *     - images
 *     - options
 *     - options.values
 *     - tags
 *     - type
 *     - variants
 *     - variants.options
 *     - variants.prices
 *   totals:
 *     - variants.purchasable
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
 *       $ref: "#/components/schemas/PricedProduct"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of products skipped when retrieving the products.
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type StoreProductsListRes = PaginatedResponse & {
  products: PricedProduct[]
}
