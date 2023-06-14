import { Router } from "express"
import { ProductTag } from "../../../../models"
import { PaginatedResponse } from "../../../../types/common"
import middlewares, { transformStoreQuery } from "../../../middlewares"
import { StoreGetProductTagsParams } from "./list-product-tags"

const route = Router()

export default (app: Router) => {
  app.use("/product-tags", route)

  route.get(
    "/",
    transformStoreQuery(StoreGetProductTagsParams, {
      defaultFields: defaultStoreProductTagFields,
      defaultRelations: defaultStoreProductTagRelations,
      allowedFields: allowedStoreProductTagFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-product-tags").default)
  )

  return app
}

export const defaultStoreProductTagFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
]

export const allowedStoreProductTagFields = [...defaultStoreProductTagFields]

export const defaultStoreProductTagRelations = []

/**
 * @schema StoreProductTagsListRes
 * type: object
 * required:
 *   - product_tags
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   product_tags:
 *      type: array
 *      items:
 *        $ref: "#/components/schemas/ProductTag"
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
export type StoreProductTagsListRes = PaginatedResponse & {
  product_tags: ProductTag[]
}

export * from "./list-product-tags"
