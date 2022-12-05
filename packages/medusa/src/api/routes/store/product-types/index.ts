import { Router } from "express"
import { ProductType } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import middlewares, { transformQuery } from "../../../middlewares"
import "reflect-metadata"
import { StoreGetProductTypesParams } from "./list-product-types"

const route = Router()

export default (app) => {
  app.use("/product-types", route)

  route.get(
    "/",
    transformQuery(StoreGetProductTypesParams, {
      defaultFields: defaultStoreProductTypeFields,
      defaultRelations: defaultStoreProductTypeRelations,
      allowedFields: allowedStoreProductTypeFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-product-types").default)
  )

  return app
}

export const allowedStoreProductTypeFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
]

export const defaultStoreProductTypeFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
]
export const defaultStoreProductTypeRelations = []

export type StoreProductTypesListRes = PaginatedResponse & {
  product_types: ProductType[]
}

export type StoreProductTypesRes = {
  product_type: ProductType
}

export * from "./list-product-types"
