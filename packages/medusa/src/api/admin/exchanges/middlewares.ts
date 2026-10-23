import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/exchanges",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
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
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminPostOrderExchangesReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/inbound/items",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostExchangesReturnRequestItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/inbound/items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(
        AdminPostExchangesRequestItemsReturnActionReqSchema
      ),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/inbound/items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminDeleteExchangeItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/inbound/shipping-method",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostExchangesShippingReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/inbound/shipping-method/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostExchangesShippingActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/inbound/shipping-method/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminDeleteExchangeItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/outbound/items",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostExchangesAddItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/outbound/items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostExchangesItemsActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/outbound/items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminDeleteExchangeItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/outbound/shipping-method",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostExchangesShippingReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/outbound/shipping-method/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostExchangesShippingActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/outbound/shipping-method/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminDeleteExchangeItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/request",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/request",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/cancel",
    middlewares: [
      authorize([
        {
          resource: Entities.order_exchange,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostCancelExchangeReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
