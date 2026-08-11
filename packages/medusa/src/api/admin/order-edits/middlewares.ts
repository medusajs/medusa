import {
  authorize,
  MiddlewareRoute,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { Entities } from "./query-config"
import {
  AdminPostOrderEditsAddItemsReqSchema,
  AdminPostOrderEditsItemsActionReqSchema,
  AdminPostOrderEditsReqSchema,
  AdminPostOrderEditsRequestReqSchema,
  AdminPostOrderEditsShippingActionReqSchema,
  AdminPostOrderEditsShippingReqSchema,
  AdminPostOrderEditsUpdateItemQuantityReqSchema,
} from "./validators"

export const adminOrderEditRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/order-edits/*",
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.read,
        },
      ]),
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
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminPostOrderEditsReqSchema),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/items",
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostOrderEditsAddItemsReqSchema),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostOrderEditsItemsActionReqSchema),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/items/item/:item_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostOrderEditsUpdateItemQuantityReqSchema),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/order-edits/:id/items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.update,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/shipping-method",
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostOrderEditsShippingReqSchema),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/shipping-method/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostOrderEditsShippingActionReqSchema),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/order-edits/:id/shipping-method/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.update,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/confirm",
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/request",
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostOrderEditsRequestReqSchema),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/order-edits/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_change,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
]
