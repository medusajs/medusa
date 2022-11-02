import { Router } from "express"
import { ProductTag } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import middlewares, { transformQuery } from "../../../middlewares"
import "reflect-metadata"
import { AdminGetProductTagsParams } from "./list-product-tags"

const route = Router()

export default (app) => {
  app.use("/product-tags", route)

  route.get(
    "/",
    transformQuery(AdminGetProductTagsParams, {
      defaultFields: defaultAdminProductTagsFields,
      defaultRelations: defaultAdminProductTagsRelations,
      allowedFields: allowedAdminProductTagsFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-product-tags").default)
  )

  return app
}

export const allowedAdminProductTagsFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
]

export const defaultAdminProductTagsFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
]
export const defaultAdminProductTagsRelations = []

export type AdminProductTagsListRes = PaginatedResponse & {
  product_tags: ProductTag[]
}

export type AdminProductTagsRes = {
  product_tag: ProductTag
}

export * from "./list-product-tags"
