import { Router } from "express"

import middlewares, {
  transformQuery,
  transformBody,
} from "../../../middlewares"

import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import deleteProductCategory from "./delete-product-category"
import { validateProductsExist } from "../../../middlewares/validators/product-existence"

import getProductCategory, {
  AdminGetProductCategoryParams,
} from "./get-product-category"

import listProductCategories, {
  AdminGetProductCategoriesParams,
} from "./list-product-categories"

import createProductCategory, {
  AdminPostProductCategoriesReq,
  AdminPostProductCategoriesParams,
} from "./create-product-category"

import updateProductCategory, {
  AdminPostProductCategoriesCategoryReq,
  AdminPostProductCategoriesCategoryParams,
} from "./update-product-category"

import addProductsBatch, {
  AdminPostProductCategoriesCategoryProductsBatchReq,
  AdminPostProductCategoriesCategoryProductsBatchParams,
} from "./add-products-batch"

import deleteProductsBatch, {
  AdminDeleteProductCategoriesCategoryProductsBatchReq,
  AdminDeleteProductCategoriesCategoryProductsBatchParams,
} from "./delete-products-batch"

import { ProductCategory } from "../../../../models"

const route = Router()

export default (app) => {
  const retrieveTransformQueryConfig = {
    defaultFields: defaultProductCategoryFields,
    defaultRelations: defaultAdminProductCategoryRelations,
    allowedRelations: allowedAdminProductCategoryRelations,
    isList: false,
  }

  const listTransformQueryConfig = {
    ...retrieveTransformQueryConfig,
    isList: true,
  }

  app.use(
    "/product-categories",
    isFeatureFlagEnabled("product_categories"),
    route
  )

  route.post(
    "/",
    transformQuery(
      AdminPostProductCategoriesParams,
      retrieveTransformQueryConfig
    ),
    transformBody(AdminPostProductCategoriesReq),
    middlewares.wrap(createProductCategory)
  )

  route.get(
    "/",
    transformQuery(AdminGetProductCategoriesParams, listTransformQueryConfig),
    middlewares.wrap(listProductCategories)
  )

  route.get(
    "/:id",
    transformQuery(AdminGetProductCategoryParams, retrieveTransformQueryConfig),
    middlewares.wrap(getProductCategory)
  )

  route.post(
    "/:id",
    transformQuery(
      AdminPostProductCategoriesCategoryParams,
      retrieveTransformQueryConfig
    ),
    transformBody(AdminPostProductCategoriesCategoryReq),
    middlewares.wrap(updateProductCategory)
  )

  route.delete("/:id", middlewares.wrap(deleteProductCategory))

  route.post(
    "/:id/products/batch",
    transformQuery(
      AdminPostProductCategoriesCategoryProductsBatchParams,
      retrieveTransformQueryConfig
    ),
    transformBody(AdminPostProductCategoriesCategoryProductsBatchReq),
    validateProductsExist((req) => req.body.product_ids),
    middlewares.wrap(addProductsBatch)
  )

  route.delete(
    "/:id/products/batch",
    transformQuery(
      AdminDeleteProductCategoriesCategoryProductsBatchParams,
      retrieveTransformQueryConfig
    ),
    transformBody(AdminDeleteProductCategoriesCategoryProductsBatchReq),
    validateProductsExist((req) => req.body.product_ids),
    middlewares.wrap(deleteProductsBatch)
  )

  return app
}

export * from "./get-product-category"
export * from "./delete-product-category"
export * from "./list-product-categories"
export * from "./create-product-category"
export * from "./update-product-category"
export * from "./add-products-batch"
export * from "./delete-products-batch"

export const defaultAdminProductCategoryRelations = [
  "parent_category",
  "category_children",
]

export const allowedAdminProductCategoryRelations = [
  "parent_category",
  "category_children",
]

export const defaultProductCategoryFields = [
  "id",
  "name",
  "handle",
  "is_active",
  "is_internal",
  "created_at",
  "updated_at",
]

/**
 * @schema AdminProductCategoriesCategoryRes
 * type: object
 * properties:
 *   product_category:
 *     $ref: "#/components/schemas/ProductCategory"
 */
export type AdminProductCategoriesCategoryRes = {
  product_category: ProductCategory
}

/**
 * @schema AdminProductCategoriesCategoryDeleteRes
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted product category
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: product-category
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminProductCategoriesCategoryDeleteRes = DeleteResponse

/**
 * @schema AdminProductCategoriesListRes
 * type: object
 * properties:
 *   product_categories:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ProductCategory"
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
export type AdminProductCategoriesListRes = PaginatedResponse & {
  product_categories: ProductCategory[]
}
