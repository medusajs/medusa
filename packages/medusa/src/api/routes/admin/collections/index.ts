import { Router } from "express"
import "reflect-metadata"
import { ProductCollection } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/collections", route)

  route.post("/", middlewares.wrap(require("./create-collection").default))
  route.post("/:id", middlewares.wrap(require("./update-collection").default))

  route.delete("/:id", middlewares.wrap(require("./delete-collection").default))

  route.get("/:id", middlewares.wrap(require("./get-collection").default))
  route.get("/", middlewares.wrap(require("./list-collections").default))

  route.post(
    "/:id/products/batch",
    middlewares.wrap(require("./add-products").default)
  )
  route.delete(
    "/:id/products/batch",
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
