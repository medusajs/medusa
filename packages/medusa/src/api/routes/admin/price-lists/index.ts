import { Router } from "express"
import "reflect-metadata"
import { PriceList } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/price-lists", route)

  route.get("/:id", middlewares.wrap(require("./get-price-list").default))

  route.get(
    "/",
    middlewares.normalizeQuery(),
    middlewares.wrap(require("./list-price-lists").default)
  )

  route.get(
    "/:id/products",
    middlewares.wrap(require("./list-price-list-products").default)
  )

  route.post("/", middlewares.wrap(require("./create-price-list").default))

  route.post("/:id", middlewares.wrap(require("./update-price-list").default))

  route.delete("/:id", middlewares.wrap(require("./delete-price-list").default))

  route.delete(
    "/:id/prices/batch",
    middlewares.wrap(require("./delete-prices-batch").default)
  )

  route.post(
    "/:id/prices/batch",
    middlewares.wrap(require("./add-prices-batch").default)
  )

  return app
}

export const defaultAdminPriceListFields = [
  "id",
  "name",
  "description",
  "type",
  "status",
  "starts_at",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultAdminPriceListRelations = ["prices", "customer_groups"]

export const allowedAdminPriceListFields = ["prices", "customer_groups"]

export type AdminPriceListRes = {
  price_list: PriceList
}

export type AdminPriceListDeleteBatchRes = {
  ids: string[]
  deleted: boolean
  object: string
}

export type AdminPriceListDeleteRes = DeleteResponse

export type AdminPriceListsListRes = PaginatedResponse & {
  price_lists: PriceList[]
}

export * from "./add-prices-batch"
export * from "./create-price-list"
export * from "./delete-price-list"
export * from "./get-price-list"
export * from "./list-price-lists"
export * from "./update-price-list"
export * from "./delete-prices-batch"
export * from "./list-price-list-products"
