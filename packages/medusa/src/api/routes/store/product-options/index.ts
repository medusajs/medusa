import { Router } from "express"
import { PaginatedResponse } from "../../../../types/common"
import middlewares, { transformQuery } from "../../../middlewares"
import "reflect-metadata"
import { ProductOption } from "../../../../models"
import { StoreGetProductOptionsParams } from "./list-product-options"

const route = Router()

export default (app) => {
  app.use("/product-options", route)

  route.get(
    "/",
    transformQuery(StoreGetProductOptionsParams, {
      defaultRelations: defaultStoreProductOptionRelations,
      allowedFields: defaultStoreProductOptionFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-product-options").default)
  )
  route.get("/:id", middlewares.wrap(require("./get-product-option").default))

  return app
}

export const defaultStoreProductOptionFields = [
  "id",
  "title",
  "product_id",
  "metadata",
]
export const defaultStoreProductOptionRelations = ["values"]

export type StoreProductOptionsListRes = PaginatedResponse & {
  product_options: ProductOption[]
}

export type StoreProductOptionsRes = {
  product_option: ProductOption
}

export * from "./list-product-options"
export * from "./get-product-option"
