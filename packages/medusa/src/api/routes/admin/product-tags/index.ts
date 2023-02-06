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
 * properties:
 *   product_tags:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ProductTag"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of items skipped before these items
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminProductTagsListRes = PaginatedResponse & {
  product_tags: ProductTag[]
}

export * from "./list-product-tags"
