import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminDeleteExchangeItemActionSchema,
  AdminGetExchangeParams,
  AdminGetOrdersOrderParams,
  AdminGetOrdersParams,
  AdminPostCancelExchangeReqSchema,
  AdminPostExchangesAddItemsReqSchema,
  AdminPostExchangesItemsActionReqSchema,
  AdminPostExchangesRequestItemsReturnActionReqSchema,
  AdminPostExchangesReturnRequestItemsReqSchema,
  AdminPostExchangesShippingActionReqSchema,
  AdminPostExchangesShippingReqSchema,
  AdminPostOrderExchangesReqSchema,
} from "./validators"

export const adminExchangeRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/exchanges/*",
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/exchanges",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/exchanges/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetExchangeParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges",
    middlewares: [
      validateAndTransformBody(AdminPostOrderExchangesReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/inbound/items",
    middlewares: [
      validateAndTransformBody(AdminPostExchangesReturnRequestItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/inbound/items/:action_id",
    middlewares: [
      validateAndTransformBody(
        AdminPostExchangesRequestItemsReturnActionReqSchema
      ),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/inbound/items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminDeleteExchangeItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/inbound/shipping-method",
    middlewares: [
      validateAndTransformBody(AdminPostExchangesShippingReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/inbound/shipping-method/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostExchangesShippingActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/inbound/shipping-method/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminDeleteExchangeItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/outbound/items",
    middlewares: [
      validateAndTransformBody(AdminPostExchangesAddItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/outbound/items/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostExchangesItemsActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/outbound/items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminDeleteExchangeItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/outbound/shipping-method",
    middlewares: [
      validateAndTransformBody(AdminPostExchangesShippingReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/outbound/shipping-method/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostExchangesShippingActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/outbound/shipping-method/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminDeleteExchangeItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/request",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/request",
    middlewares: [],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.delete,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/cancel",
    middlewares: [
      validateAndTransformBody(AdminPostCancelExchangeReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_exchange,
        operation: PolicyOperation.update,
      },
    ],
  },
]
