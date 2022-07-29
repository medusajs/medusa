import { Router } from "express"
import { ProductType } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import "reflect-metadata"

const route = Router()

export default (app) => {
  app.use("/product-types", route)

  route.get("/", require("./list-product-types").default)

  return app
}

export const allowedAdminProductTypeFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
]

export const defaultAdminProductTypeFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
]
export const defaultAdminProductTypeRelations = []

export type AdminProductTypesListRes = PaginatedResponse & {
  product_types: ProductType[]
}

export type AdminProductTypesRes = {
  product_type: ProductType
}

export * from "./list-product-types"
