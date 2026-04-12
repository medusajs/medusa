import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminAddDraftOrderItems,
  AdminAddDraftOrderPromotions,
  AdminAddDraftOrderShippingMethod,
  AdminCreateDraftOrder,
  AdminGetDraftOrderParams,
  AdminGetDraftOrdersParams,
  AdminRemoveDraftOrderPromotions,
  AdminUpdateDraftOrder,
  AdminUpdateDraftOrderActionItem,
  AdminUpdateDraftOrderActionShippingMethod,
  AdminUpdateDraftOrderItem,
  AdminUpdateDraftOrderShippingMethod,
} from "./validators"

export const adminDraftOrderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/draft-orders/*",
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/draft-orders",
    middlewares: [
      validateAndTransformQuery(
        AdminGetDraftOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/draft-orders/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders",
    middlewares: [
      validateAndTransformBody(AdminCreateDraftOrder),
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateDraftOrder),
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/convert-to-order",
    middlewares: [
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/items",
    middlewares: [validateAndTransformBody(AdminAddDraftOrderItems)],
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/items/item/:item_id",
    middlewares: [validateAndTransformBody(AdminUpdateDraftOrderItem)],
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/items/:action_id",
    middlewares: [validateAndTransformBody(AdminUpdateDraftOrderActionItem)],
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/promotions",
    middlewares: [validateAndTransformBody(AdminAddDraftOrderPromotions)],
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/draft-orders/:id/edit/promotions",
    middlewares: [validateAndTransformBody(AdminRemoveDraftOrderPromotions)],
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/shipping-methods",
    middlewares: [validateAndTransformBody(AdminAddDraftOrderShippingMethod)],
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/shipping-methods/method/:method_id",
    middlewares: [
      validateAndTransformBody(AdminUpdateDraftOrderShippingMethod),
    ],
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/shipping-methods/:action_id",
    middlewares: [
      validateAndTransformBody(AdminUpdateDraftOrderActionShippingMethod),
    ],
    policies: [
      {
        resource: Entities.order,
        operation: PolicyOperation.update,
      },
    ],
  },
]
