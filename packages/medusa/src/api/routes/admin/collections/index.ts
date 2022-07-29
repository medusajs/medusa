import { Router } from "express"
import "reflect-metadata"
import { ProductCollection } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import { transformBody, transformQuery } from "../../../middlewares"
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
    require("./create-collection").default
  )
  route.get(
    "/",
    transformQuery(AdminGetCollectionsParams, {
      defaultRelations: defaultAdminCollectionsRelations,
      defaultFields: defaultAdminCollectionsFields,
      isList: true,
    }),
    require("./list-collections").default
  )

  const collectionRouter = Router({ mergeParams: true })
  route.use("/:id", collectionRouter)
  collectionRouter.post(
    "/",
    transformBody(AdminPostCollectionsCollectionReq),
    require("./update-collection").default
  )
  collectionRouter.get("/", require("./get-collection").default)
  collectionRouter.delete("/", require("./delete-collection").default)
  collectionRouter.post(
    "/products/batch",
    transformBody(AdminPostProductsToCollectionReq),
    require("./add-products").default
  )
  collectionRouter.delete(
    "/products/batch",
    transformBody(AdminDeleteProductsFromCollectionReq),
    require("./remove-products").default
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

export type AdminCollectionsListRes = PaginatedResponse & {
  collections: ProductCollection[]
}

export type AdminCollectionsDeleteRes = DeleteResponse

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
