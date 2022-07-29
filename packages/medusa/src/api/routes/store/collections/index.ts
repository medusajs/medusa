import { Router } from "express"
import { PaginatedResponse } from "./../../../../types/common"
import { ProductCollection } from "../../../../"

const route = Router()

export default (app) => {
  app.use("/collections", route)

  route.get("/", require("./list-collections").default)
  route.get("/:id", require("./get-collection").default)

  return app
}

export const defaultStoreCollectionFields = ["id", "title", "handle"]
export const defaultStoreCollectionRelations = ["products"]

export type StoreCollectionsListRes = PaginatedResponse & {
  collections: ProductCollection[]
}

export type StoreCollectionsRes = {
  collection: ProductCollection
}

export * from "./get-collection"
export * from "./list-collections"
