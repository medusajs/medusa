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

export const defaultStoreCollectionRelations = []
export const allowedFields = [
  "id",
  "title",
  "handle",
  "products",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
  ...defaultStoreCollectionRelations,
]

/**
 * @schema StoreCollectionsListRes
 * type: object
 * description: "The list of product collections with pagination fields."
 * required:
 *   - collections
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   collections:
 *      type: array
 *      description: "An array of product collections details"
 *      items:
 *        $ref: "#/components/schemas/ProductCollection"
 *   count:
 *      type: integer
 *      description: The total number of items available
 *   offset:
 *      type: integer
 *      description: The number of product collections skipped when retrieving the product collections.
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
 * description: "The details of the product collection."
 * required:
 *   - collection
 * properties:
 *   collection:
 *     description: "Product collection details."
 *     $ref: "#/components/schemas/ProductCollection"
 */
export type StoreCollectionsRes = {
  collection: ProductCollection
}

export * from "./get-collection"
export * from "./list-collections"
