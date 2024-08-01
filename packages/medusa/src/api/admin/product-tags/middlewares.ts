import * as QueryConfig from "./query-config"
import { MiddlewareRoute } from "@medusajs/framework"
import { validateAndTransformQuery } from "../../utils/validate-query"
import {
  AdminCreateProductTag,
  AdminGetProductTagParams,
  AdminGetProductTagsParams,
  AdminUpdateProductTag,
} from "./validators"
import { validateAndTransformBody } from "../../utils/validate-body"

export const adminProductTagRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/product-tags",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductTagsParams,
        QueryConfig.listProductTagsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-tags/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductTagParams,
        QueryConfig.retrieveProductTagTransformQueryConfig
      ),
    ],
  },
  // Create/update/delete methods are new in v2
  {
    method: ["POST"],
    matcher: "/admin/product-tags",
    middlewares: [
      validateAndTransformBody(AdminCreateProductTag),
      validateAndTransformQuery(
        AdminGetProductTagParams,
        QueryConfig.retrieveProductTagTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/product-tags/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateProductTag),
      validateAndTransformQuery(
        AdminGetProductTagParams,
        QueryConfig.retrieveProductTagTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/product-tags/:id",
    middlewares: [],
  },
]
