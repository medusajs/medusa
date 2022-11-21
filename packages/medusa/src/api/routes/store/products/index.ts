import { RequestHandler, Router } from "express"
import "reflect-metadata"

import { Product } from "../../../.."
import middlewares from "../../../middlewares"
import { FlagRouter } from "../../../../utils/flag-router"
import { PaginatedResponse } from "../../../../types/common"
import { extendResourceFilters } from "../../../middlewares/publishable-api-key/extend-resource-filters"
import PublishableAPIKeysFeatureFlag from "../../../../loaders/feature-flags/publishable-api-keys"

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  app.use("/products", route)

  if (featureFlagRouter.isFeatureEnabled(PublishableAPIKeysFeatureFlag.key)) {
    route.get(
      "/",
      extendResourceFilters as unknown as RequestHandler,
      middlewares.wrap(require("./list-products").default)
    )
  } else {
    route.get("/", middlewares.wrap(require("./list-products").default))
  }

  route.post("/search", middlewares.wrap(require("./search").default))
  route.get("/:id", middlewares.wrap(require("./get-product").default))

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
