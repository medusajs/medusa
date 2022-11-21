import { RequestHandler, Router } from "express"
import "reflect-metadata"

import { Product } from "../../../.."
import middlewares from "../../../middlewares"
import { FlagRouter } from "../../../../utils/flag-router"
import { PaginatedResponse } from "../../../../types/common"
import { extendResourceFilters } from "../../../middlewares/publishable-api-key/extend-resource-filters"
import PublishableAPIKeysFeatureFlag from "../../../../loaders/feature-flags/publishable-api-keys"
import { validateProduct } from "../../../middlewares/publishable-api-key/validate-product"

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  app.use("/products", route)

  if (featureFlagRouter.isFeatureEnabled(PublishableAPIKeysFeatureFlag.key)) {
    route.use("/", extendResourceFilters as unknown as RequestHandler)
    route.use("/:id", validateProduct)
  }

  route.get("/", middlewares.wrap(require("./list-products").default))
  route.get("/:id", middlewares.wrap(require("./get-product").default))
  route.post("/search", middlewares.wrap(require("./search").default))

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
