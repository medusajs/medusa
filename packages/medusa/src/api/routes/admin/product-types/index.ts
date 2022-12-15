import { Router } from "express"
import { ProductType } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import middlewares, { transformQuery } from "../../../middlewares"
import "reflect-metadata"
import { AdminGetProductTypesParams } from "./list-product-types"

const route = Router()

export default (app) => {
  app.use("/product-types", route)

  route.get(
    "/",
    transformQuery(AdminGetProductTypesParams, {
      defaultFields: defaultAdminProductTypeFields,
      defaultRelations: defaultAdminProductTypeRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-product-types").default)
  )

  return app
}

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
