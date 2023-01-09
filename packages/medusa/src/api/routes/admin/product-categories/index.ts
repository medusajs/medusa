import { Router } from "express"
import middlewares from "../../../middlewares"
import getProductCategory from "./get-product-category"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"

const route = Router()

export default (app) => {
  app.use(
    "/product-categories",
    isFeatureFlagEnabled("product_categories"),
    route
  )

  route.get("/:id", middlewares.wrap(getProductCategory))

  return app
}

export * from "./get-product-category"

export const defaultAdminProductCategoryRelations = [
  "parent_category",
  "category_children",
]
