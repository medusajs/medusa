import { Router } from "express"
import { ProductType } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import "reflect-metadata"
import { AdminGetProductTypesParams } from "./list-product-types"
import { AdminPostProductTypesReq } from "./create-product-type"
import { AdminPostProductTypeReq } from "./update-product-type"

const route = Router()

export default (app) => {
  app.use("/product-types", route)

  route.get(
    "/",
    transformQuery(AdminGetProductTypesParams, {
      defaultRelations: defaultAdminProductTypeRelations,
      allowedFields: defaultAdminProductTypeFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-product-types").default)
  )
  route.post(
    "/",
    transformBody(AdminPostProductTypesReq),
    middlewares.wrap(require("./create-product-type").default)
  )

  const typeRouter = Router({ mergeParams: true })
  route.use("/:id", typeRouter)

  typeRouter.get("/", middlewares.wrap(require("./get-product-type").default))
  typeRouter.delete(
    "/",
    middlewares.wrap(require("./delete-product-type").default)
  )
  typeRouter.put(
    "/",
    transformBody(AdminPostProductTypeReq),
    middlewares.wrap(require("./update-product-type").default)
  )

  return app
}

export const defaultAdminProductTypeFields = [
  "id",
  "value",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminProductTypeRelations = []

/**
 * @schema AdminProductTypesListRes
 * type: object
 * required:
 *   - product_types
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   product_types:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ProductType"
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
export type AdminProductTypesListRes = PaginatedResponse & {
  product_types: ProductType[]
}

export type AdminProductTypesRes = {
  product_type: ProductType
}

export * from "./list-product-types"
export * from "./get-product-type"
export * from "./create-product-type"
export * from "./update-product-type"
export * from "./delete-product-type"
