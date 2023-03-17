import { Router } from "express"
import "reflect-metadata"
import { ProductCollection } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { AdminGetCollectionsParams } from "./list-collections"
import { AdminPostCollectionsReq } from "./create-collection"
import { AdminPostCollectionsCollectionReq } from "./update-collection"
import { AdminPostProductsToCollectionReq } from "./add-products"
import { AdminDeleteProductsFromCollectionReq } from "./remove-products"

export default (app) => {
  const route = Router()
  app.use("/collections", route)

  route.post(
    "/",
    transformBody(AdminPostCollectionsReq),
    middlewares.wrap(require("./create-collection").default)
  )
  route.get(
    "/",
    transformQuery(AdminGetCollectionsParams, {
      defaultRelations: defaultAdminCollectionsRelations,
      defaultFields: defaultAdminCollectionsFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-collections").default)
  )

  const collectionRouter = Router({ mergeParams: true })
  route.use("/:id", collectionRouter)
  collectionRouter.post(
    "/",
    transformBody(AdminPostCollectionsCollectionReq),
    middlewares.wrap(require("./update-collection").default)
  )
  collectionRouter.get(
    "/",
    middlewares.wrap(require("./get-collection").default)
  )
  collectionRouter.delete(
    "/",
    middlewares.wrap(require("./delete-collection").default)
  )
  collectionRouter.post(
    "/products/batch",
    transformBody(AdminPostProductsToCollectionReq),
    middlewares.wrap(require("./add-products").default)
  )
  collectionRouter.delete(
    "/products/batch",
    transformBody(AdminDeleteProductsFromCollectionReq),
    middlewares.wrap(require("./remove-products").default)
  )

  return app
}

export const defaultAdminCollectionsFields = [
  "id",
  "title",
  "handle",
  "created_at",
  "updated_at",
]
export const defaultAdminCollectionsRelations = ["products"]

/**
 * @schema AdminCollectionsListRes
 * type: object
 * required:
 *   - collections
 *   - count
 *   - offset
 *   - limit
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
export type AdminCollectionsListRes = PaginatedResponse & {
  collections: ProductCollection[]
}

/**
 * @schema AdminCollectionsDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Collection
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: product-collection
 *   deleted:
 *     type: boolean
 *     description: Whether the collection was deleted successfully or not.
 *     default: true
 */
export type AdminCollectionsDeleteRes = DeleteResponse

/**
 * @schema AdminDeleteProductsFromCollectionRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - removed_products
 * properties:
 *   id:
 *     type: string
 *     description: "The ID of the collection"
 *   object:
 *     type: string
 *     description: "The type of object the removal was executed on"
 *     default: product-collection
 *   removed_products:
 *     description: "The IDs of the products removed from the collection"
 *     type: array
 *     items:
 *       description: "The ID of a Product to add to the Product Collection."
 *       type: string
 */
export type AdminDeleteProductsFromCollectionRes = {
  id: string
  object: string
  removed_products: string[]
}

/**
 * @schema AdminCollectionsRes
 * type: object
 * x-expanded-relations:
 *   field: collection
 *   relations:
 *     - products
 * required:
 *   - collection
 * properties:
 *   collection:
 *     $ref: "#/components/schemas/ProductCollection"
 */
export type AdminCollectionsRes = {
  collection: ProductCollection
}

export * from "./add-products"
export * from "./create-collection"
export * from "./delete-collection"
export * from "./get-collection"
export * from "./list-collections"
export * from "./remove-products"
export * from "./update-collection"
