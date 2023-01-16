import { Router } from "express"
import { PaginatedResponse } from "../../../../types/common"
import { ProductCollection } from "../../../../"
import middlewares, { transformQuery } from "../../../middlewares"
import { StoreGetCollectionsParams } from "./list-collections"

const route = Router()

export default (app) => {
  app.use("/collections", route)

  route.get(
    "/",
    transformQuery(StoreGetCollectionsParams, {
      allowedFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-collections").default)
  )
  route.get("/:id", middlewares.wrap(require("./get-collection").default))

  return app
}

export const defaultStoreCollectionRelations = ["products"]
export const allowedFields = [
  "id",
  "title",
  "handle",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
  ...defaultStoreCollectionRelations,
]

export type StoreCollectionsListRes = PaginatedResponse & {
  collections: ProductCollection[]
}

export type StoreCollectionsRes = {
  collection: ProductCollection
}

export * from "./get-collection"
export * from "./list-collections"
