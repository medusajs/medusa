import { Router } from "express"
import middlewares, { transformQuery } from "../../../middlewares"
import getProductCategory, {
  GetProductCategoryParams,
} from "./get-product-category"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"

const route = Router()

export default (app) => {
  app.use(
    "/product-categories",
    isFeatureFlagEnabled("product_categories"),
    route
  )

  route.get(
    "/:id",
    transformQuery(GetProductCategoryParams, {
      defaultFields: defaultProductCategoryFields,
      isList: false,
    }),
    middlewares.wrap(getProductCategory)
  )

  return app
}

export * from "./get-product-category"

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
