import { Router } from "express"
import { ProductTag } from "../../../../models"
import { PaginatedResponse } from "../../../../types/common"
import middlewares, { transformQuery } from "../../../middlewares"
import { StoreGetProductTagsParams } from "./list-product-tags"

const route = Router()

export default (app: Router) => {
  app.use("/product-tags", route)

  route.get(
    "/",
    transformQuery(StoreGetProductTagsParams, {
      defaultFields: defaultStoreProductTagFields,
      defaultRelations: defaultStoreProductTagRelations,
      allowedFields: allowedStoreProductTagFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-product-tags").default)
  )

  return app
}

export const defaultStoreProductTagFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
]

export const allowedStoreProductTagFields = [...defaultStoreProductTagFields]

export const defaultStoreProductTagRelations = []

export type StoreProductTagsListRes = PaginatedResponse & {
  product_tags: ProductTag[]
}

export * from "./list-product-tags"
