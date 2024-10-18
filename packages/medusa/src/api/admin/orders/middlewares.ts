import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import * as QueryConfig from "./query-config"
import {
  AdminCompleteOrder,
  AdminGetOrdersOrderItemsParams,
  AdminGetOrdersOrderParams,
  AdminGetOrdersParams,
  AdminMarkOrderFulfillmentDelivered,
  AdminOrderCancelFulfillment,
  AdminOrderChanges,
  AdminOrderCreateFulfillment,
  AdminOrderCreateShipment,
} from "./validators"

export const adminOrderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/orders",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/orders/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/orders/:id/line-items",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderItemsParams,
        QueryConfig.listOrderItemsQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/orders/:id/changes",
    middlewares: [
      validateAndTransformQuery(
        AdminOrderChanges,
        QueryConfig.retrieveOrderChangesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/orders/:id/preview",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/archive",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/cancel",
    middlewares: [
      // validateAndTransformBody(),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/complete",
    middlewares: [
      validateAndTransformBody(AdminCompleteOrder),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/orders/:id/fulfillments",
    middlewares: [
      validateAndTransformBody(AdminOrderCreateFulfillment),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/fulfillments/:fulfillment_id/cancel",
    middlewares: [
      validateAndTransformBody(AdminOrderCancelFulfillment),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/fulfillments/:fulfillment_id/shipments",
    middlewares: [
      validateAndTransformBody(AdminOrderCreateShipment),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/orders/:id/fulfillments/:fulfillment_id/mark-as-delivered",
    middlewares: [
      validateAndTransformBody(AdminMarkOrderFulfillmentDelivered),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
