import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateOrderTag,
  AdminGetOrderTagParams,
  AdminGetOrderTagsParams,
  AdminUpdateOrderTag,
} from "./validators"

export const adminOrderTagRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/order-tags/*",
    policies: [
      {
        resource: Entities.order_tag,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/order-tags",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrderTagsParams,
        QueryConfig.listOrderTagsTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_tag,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/order-tags/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrderTagParams,
        QueryConfig.retrieveOrderTagTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-tags",
    middlewares: [
      validateAndTransformBody(AdminCreateOrderTag),
      validateAndTransformQuery(
        AdminGetOrderTagParams,
        QueryConfig.retrieveOrderTagTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_tag,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-tags/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateOrderTag),
      validateAndTransformQuery(
        AdminGetOrderTagParams,
        QueryConfig.retrieveOrderTagTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_tag,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/order-tags/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.order_tag,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
