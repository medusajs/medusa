import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/products", route)

  route.post("/", middlewares.wrap(require("./create-product").default))
  route.post("/:id", middlewares.wrap(require("./update-product").default))
  route.get("/types", middlewares.wrap(require("./list-types").default))
  route.get(
    "/tag-usage",
    middlewares.wrap(require("./list-tag-usage-count").default)
  )

  route.post(
    "/:id/variants",
    middlewares.wrap(require("./create-variant").default)
  )

  route.post(
    "/:id/variants/:variant_id",
    middlewares.wrap(require("./update-variant").default)
  )

  route.post(
    "/:id/options/:option_id",
    middlewares.wrap(require("./update-option").default)
  )
  route.post("/:id/options", middlewares.wrap(require("./add-option").default))

  route.delete(
    "/:id/variants/:variant_id",
    middlewares.wrap(require("./delete-variant").default)
  )
  route.delete("/:id", middlewares.wrap(require("./delete-product").default))
  route.delete(
    "/:id/options/:option_id",
    middlewares.wrap(require("./delete-option").default)
  )

  route.post(
    "/:id/metadata",
    middlewares.wrap(require("./set-metadata").default)
  )

  route.get("/:id", middlewares.wrap(require("./get-product").default))
  route.get(
    "/",
    middlewares.normalizeQuery(),
    middlewares.wrap(require("./list-products").default)
  )

  return app
}

export const defaultRelations = [
  "variants",
  "variants.prices",
  "variants.options",
  "images",
  "options",
  "tags",
  "type",
  "collection",
]

export const defaultFields = [
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

export const allowedFields = [
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

export const allowedRelations = [
  "variants",
  "variants.prices",
  "images",
  "options",
  "tags",
  "type",
  "collection",
]

export const filterableFields = [
  "id",
  "status",
  "collection_id",
  "tags",
  "title",
  "description",
  "handle",
  "is_giftcard",
  "type",
  "created_at",
  "updated_at",
  "deleted_at",
]
