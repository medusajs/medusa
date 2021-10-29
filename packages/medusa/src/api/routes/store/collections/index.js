import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/collections", route)

  route.get("/", middlewares.wrap(require("./list-collections").default))
  route.get("/:id", middlewares.wrap(require("./get-collection").default))
  route.get(
    "/:id/products",
    middlewares.normalizeQuery(),
    middlewares.wrap(require("./get-collection-products").default)
  )

  return app
}

export const productRelations = [
  "variants",
  "variants.prices",
  "options",
  "options.values",
  "images",
  "tags",
  "collection",
  "type",
]

export const productFields = [
  "id",
  "title",
  "subtitle",
  "description",
  "handle",
  "is_giftcard",
  "discountable",
  "thumbnail",
  "profile_id",
  "collection_id",
  "type_id",
  "weight",
  "length",
  "height",
  "width",
  "hs_code",
  "origin_country",
  "mid_code",
  "material",
  "created_at",
  "updated_at",
  "metadata",
]
