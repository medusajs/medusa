import {
  MiddlewareRoute,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { Entities } from "./query-config"
import {
  AdminPostOrderEditsAddItemsReqSchema,
  AdminPostOrderEditsItemsActionReqSchema,
  AdminPostOrderEditsReqSchema,
  AdminPostOrderEditsShippingActionReqSchema,
  AdminPostOrderEditsShippingReqSchema,
  AdminPostOrderEditsUpdateItemQuantityReqSchema,
} from "./validators"

export const adminOrderEditRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/order-edits/*",
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/order-edits/:id",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits",
    middlewares: [validateAndTransformBody(AdminPostOrderEditsReqSchema)],
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.create,
      },
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/items",
    middlewares: [
      validateAndTransformBody(AdminPostOrderEditsAddItemsReqSchema),
    ],
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/items/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostOrderEditsItemsActionReqSchema),
    ],
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/items/item/:item_id",
    middlewares: [
      validateAndTransformBody(AdminPostOrderEditsUpdateItemQuantityReqSchema),
    ],
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/order-edits/:id/items/:action_id",
    middlewares: [],
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.delete,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/shipping-method",
    middlewares: [
      validateAndTransformBody(AdminPostOrderEditsShippingReqSchema),
    ],
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/shipping-method/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostOrderEditsShippingActionReqSchema),
    ],
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/order-edits/:id/shipping-method/:action_id",
    middlewares: [],
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/confirm",
    middlewares: [],
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/request",
    middlewares: [],
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/order-edits/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.order_change,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
