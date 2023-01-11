import { Router } from "express"

import middlewares, { transformQuery, transformBody } from "../../../middlewares"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import deleteProductCategory from "./delete-product-category"

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

const route = Router()

export default (app) => {
  app.use(
    "/product-categories",
    isFeatureFlagEnabled("product_categories"),
    route
  )

  route.post(
    "/",
    transformQuery(AdminPostProductCategoriesParams, {
      defaultFields: defaultProductCategoryFields,
      defaultRelations: defaultAdminProductCategoryRelations,
      isList: false,
    }),
    transformBody(AdminPostProductCategoriesReq),
    middlewares.wrap(createProductCategory)
  )

  route.get(
    "/",
    transformQuery(AdminGetProductCategoriesParams, {
      defaultFields: defaultProductCategoryFields,
      defaultRelations: defaultAdminProductCategoryRelations,
      isList: true,
    }),
    middlewares.wrap(listProductCategories)
  )

  route.get(
    "/:id",
    transformQuery(AdminGetProductCategoryParams, {
      defaultFields: defaultProductCategoryFields,
      isList: false,
    }),
    middlewares.wrap(getProductCategory)
  )

  route.delete("/:id", middlewares.wrap(deleteProductCategory))

  return app
}

export * from "./get-product-category"
export * from "./delete-product-category"
export * from "./list-product-categories"
export * from "./create-product-category"

export const defaultAdminProductCategoryRelations = [
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
