import { MiddlewareRoute } from "@medusajs/framework"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  AdminGetOrdersOrderParams,
  AdminPostOrderEditsAddItemsReqSchema,
  AdminPostOrderEditsItemsActionReqSchema,
  AdminPostOrderEditsReqSchema,
  AdminPostOrderEditsShippingActionReqSchema,
  AdminPostOrderEditsShippingReqSchema,
} from "./validators"

export const adminOrderEditRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/order-edits/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits",
    middlewares: [
      validateAndTransformBody(AdminPostOrderEditsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/items",
    middlewares: [
      validateAndTransformBody(AdminPostOrderEditsAddItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/items/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostOrderEditsItemsActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/order-edits/:id/items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/shipping-method",
    middlewares: [
      validateAndTransformBody(AdminPostOrderEditsShippingReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/shipping-method/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostOrderEditsShippingActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/order-edits/:id/shipping-method/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/order-edits/:id/request",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/order-edits/:id/request",
    middlewares: [],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/order-edits/:id",
    middlewares: [],
  },
]
