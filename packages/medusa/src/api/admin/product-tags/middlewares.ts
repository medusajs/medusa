import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
    middlewares: [
      authorize([
        {
          resource: Entities.product_tag,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-tags",
    middlewares: [
      authorize([
        {
          resource: Entities.product_tag,
          operation: PolicyOperation.read,
        },
      ]),
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
      authorize([
        {
          resource: Entities.product_tag,
          operation: PolicyOperation.create,
        },
      ]),
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
      authorize([
        {
          resource: Entities.product_tag,
          operation: PolicyOperation.update,
        },
      ]),
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
    middlewares: [
      authorize([
        {
          resource: Entities.product_tag,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
]
