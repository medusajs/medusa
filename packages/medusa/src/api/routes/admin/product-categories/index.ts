import { Router } from "express"
import middlewares, { transformQuery } from "../../../middlewares"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"

import getProductCategory, {
  AdminGetProductCategoryParams,
} from "./get-product-category"

import listProductCategories, {
  AdminGetProductCategoriesParams,
} from "./list-product-categories"

const route = Router()

export default (app) => {
  app.use(
    "/product-categories",
    isFeatureFlagEnabled("product_categories"),
    route
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

  return app
}

export * from "./get-product-category"
export * from "./list-product-categories"

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
]
