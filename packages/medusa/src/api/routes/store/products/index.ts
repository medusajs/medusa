import { Router } from "express"
import "reflect-metadata"
import { Product } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"

const route = Router()

export default (app) => {
  app.use("/products", route)

  route.get("/", require("./list-products").default)
  route.post("/search", require("./search").default)
  route.get("/:id", require("./get-product").default)

  return app
}

export const defaultStoreProductsRelations = [
  "variants",
  "variants.prices",
  "variants.options",
  "options",
  "options.values",
  "images",
  "tags",
  "collection",
  "type",
]

export * from "./list-products"
export * from "./search"

export type StoreProductsRes = {
  product: Product
}

export type StorePostSearchRes = {
  hits: unknown[]
  [k: string]: unknown
}

export type StoreProductsListRes = PaginatedResponse & {
  products: Product[]
}
