import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateProductTag,
  AdminGetProductTagParams,
  AdminGetProductTagsParams,
  AdminUpdateProductTag,
} from "./validators"

export const adminProductTagRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/product-tags/*",
    policies: [
      {
        resource: Entities.product_tag,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-tags",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductTagsParams,
        QueryConfig.listProductTagsTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.product_tag,
        operation: PolicyOperation.read,
      },
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
    policies: [
      {
        resource: Entities.product_tag,
        operation: PolicyOperation.create,
      },
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
    policies: [
      {
        resource: Entities.product_tag,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/product-tags/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.product_tag,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
