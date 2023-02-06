import { Router } from "express"
import middlewares, { transformQuery } from "../../../middlewares"
import { ProductCategory } from "../../../../models"
import { PaginatedResponse } from "../../../../types/common"

import listProductCategories, {
  StoreGetProductCategoriesParams,
} from "./list-product-categories"

import getProductCategory, {
  StoreGetProductCategoryParams,
} from "./get-product-category"

const route = Router()

export default (app) => {
  app.use("/product-categories", route)

  route.get(
    "/",
    transformQuery(StoreGetProductCategoriesParams, {
      defaultFields: defaultStoreProductCategoryFields,
      allowedFields: allowedStoreProductCategoryFields,
      defaultRelations: defaultStoreProductCategoryRelations,
      isList: true,
    }),
    middlewares.wrap(listProductCategories)
  )

  route.get(
    "/:id",
    transformQuery(StoreGetProductCategoryParams, {
      defaultFields: defaultStoreProductCategoryFields,
      allowedFields: allowedStoreProductCategoryFields,
      defaultRelations: defaultStoreProductCategoryRelations,
      isList: false,
    }),
    middlewares.wrap(getProductCategory)
  )

  return app
}

export const defaultStoreProductCategoryRelations = [
  "parent_category",
  "category_children",
]

export const defaultStoreScope = {
  is_internal: false,
  is_active: true,
}

export const defaultStoreProductCategoryFields = [
  "id",
  "name",
  "handle",
  "parent_category_id",
  "created_at",
  "updated_at",
]

export const allowedStoreProductCategoryFields = [
  "id",
  "name",
  "handle",
  "parent_category_id",
  "created_at",
  "updated_at",
]

/**
 * @schema StoreGetProductCategoriesCategoryRes
 * type: object
 * properties:
 *   product_category:
 *     $ref: "#/components/schemas/ProductCategory"
 */
export type StoreGetProductCategoriesCategoryRes = {
  product_category: ProductCategory
}

/**
 * @schema StoreProductCategoriesListRes
 * type: object
 * properties:
 *   product_categories:
 *      type: array
 *      items:
 *        $ref: "#/components/schemas/ProductCategory"
 *   count:
 *      type: integer
 *      description: The total number of items available
 *   offset:
 *      type: integer
 *      description: The number of items skipped before these items
 *   limit:
 *      type: integer
 *      description: The number of items per page
 */
export type StoreProductCategoriesListRes = PaginatedResponse & {
  product_categories: ProductCategory[]
}

export * from "./get-product-category"
export * from "./list-product-categories"
