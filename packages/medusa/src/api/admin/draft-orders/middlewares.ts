import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/draft-orders",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetDraftOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
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
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateDraftOrder),
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateDraftOrder),
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/draft-orders/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/convert-to-order",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/items",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminAddDraftOrderItems),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/items/item/:item_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateDraftOrderItem),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateDraftOrderActionItem),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/promotions",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminAddDraftOrderPromotions),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/draft-orders/:id/edit/promotions",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminRemoveDraftOrderPromotions),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/shipping-methods",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminAddDraftOrderShippingMethod),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/shipping-methods/method/:method_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateDraftOrderShippingMethod),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/edit/shipping-methods/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateDraftOrderActionShippingMethod),
    ],
  },
]
