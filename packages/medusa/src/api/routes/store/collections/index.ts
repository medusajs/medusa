import { Router } from "express"
import { PaginatedResponse } from "../../../../types/common"
import { ProductCollection } from "../../../../"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/collections", route)

  route.get("/", middlewares.wrap(require("./list-collections").default))
  route.get("/:id", middlewares.wrap(require("./get-collection").default))
  route.get(
    "/:handle/handle",
    middlewares.wrap(require("./get-collection-by-handle").default)
  )
  route.get(
    "/:handle/handle/products",
    middlewares.wrap(require("./get-collection-by-handle-products").default)
  )

  return app
}

export const defaultStoreCollectionFields = ["id", "title", "handle"]
export const allStoreCollectionRelations = ["products", "images"]
export const defaultStoreCollectionRelations = ["images"]

export type StoreCollectionsListRes = PaginatedResponse & {
  collections: ProductCollection[]
}

export type StoreCollectionsRes = {
  collection: ProductCollection
}

export * from "./get-collection"
export * from "./list-collections"
export * from "./get-collection-by-handle-products"
