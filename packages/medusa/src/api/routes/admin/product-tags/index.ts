import { Router } from "express"
import { ProductTag } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import middlewares, { transformQuery } from "../../../middlewares"
import "reflect-metadata"
import { AdminGetProductTagsParams } from "./list-product-tags"

const route = Router()

export default (app) => {
  app.use("/product-tags", route)

  route.get(
    "/",
    transformQuery(AdminGetProductTagsParams, {
      defaultFields: defaultAdminProductTagsFields,
      defaultRelations: defaultAdminProductTagsRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-product-tags").default)
  )

  return app
}

export const defaultAdminProductTagsFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
]
export const defaultAdminProductTagsRelations = []

/**
 * @schema AdminProductTagsListRes
 * type: object
 * description: "The list of product tags with pagination fields."
 * required:
 *   - product_tags
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   product_tags:
 *     type: array
 *     description: "An array of product tag details."
 *     items:
 *       $ref: "#/components/schemas/ProductTag"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of product tags skipped when retrieving the product tags.
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminProductTagsListRes = PaginatedResponse & {
  product_tags: ProductTag[]
}

export * from "./list-product-tags"
