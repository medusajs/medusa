import { Router } from "express"
import middlewares from "../../../middlewares"
import getProductCategory from './get-product-category'

const route = Router()

export default (app) => {
  app.use("/product-categories", route)

  route.get("/:id", middlewares.wrap(getProductCategory))

  return app
}

export * from "./get-product-category"

export const defaultAdminProductCategoryRelations = ["parent_category", "category_children"]
