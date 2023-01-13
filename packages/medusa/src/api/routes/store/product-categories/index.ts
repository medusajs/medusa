import { Router } from "express"
import middlewares, { transformQuery } from "../../../middlewares"
import getProductCategory, {
  StoreGetProductCategoryParams,
} from "./get-product-category"

import listProductCategories, {
  StoreGetProductCategoriesParams,
} from "./list-product-categories"

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

export * from "./get-product-category"
export * from "./list-product-categories"
