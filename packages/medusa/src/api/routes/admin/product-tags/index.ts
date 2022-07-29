import { Router } from "express"
import { ProductTag } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import "reflect-metadata"

const route = Router()

export default (app) => {
  app.use("/product-tags", route)

  route.get("/", require("./list-product-tags").default)

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
