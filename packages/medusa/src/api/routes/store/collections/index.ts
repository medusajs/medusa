import { Router } from "express"
import { PaginatedResponse } from "../../../../types/common"
import { ProductCollection } from "../../../../"
import middlewares, { transformStoreQuery } from "../../../middlewares"
import { StoreGetCollectionsParams } from "./list-collections"

const route = Router()

export default (app) => {
  app.use("/collections", route)

  route.get(
    "/",
    transformStoreQuery(StoreGetCollectionsParams, {
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

/**
 * @schema StoreCollectionsListRes
 * type: object
 * properties:
 *   collections:
 *      type: array
 *      items:
 *        $ref: "#/components/schemas/ProductCollection"
 *   count:
 *      type: integer
 *      description: The total number of items available
 *   offset:
 *      type: integer
 *      description: The number of items skipped before these items
 *   limit:
 *      type: integer
 *      description: The number of items per page
 */
export type StoreCollectionsListRes = PaginatedResponse & {
  collections: ProductCollection[]
}

/**
 * @schema StoreCollectionsRes
 * type: object
 * properties:
 *   collection:
 *     $ref: "#/components/schemas/ProductCollection"
 */
export type StoreCollectionsRes = {
  collection: ProductCollection
}

export * from "./get-collection"
export * from "./list-collections"
