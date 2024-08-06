import { MiddlewareRoute } from "@medusajs/framework"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  AdminGetOrdersOrderParams,
  AdminGetOrdersParams,
  AdminPostCancelExchangeReqSchema,
  AdminPostExchangesAddItemsReqSchema,
  AdminPostExchangesRequestItemsReturnActionReqSchema,
  AdminPostExchangesReturnRequestItemsReqSchema,
  AdminPostExchangesShippingActionReqSchema,
  AdminPostExchangesShippingReqSchema,
  AdminPostExhangesItemsActionReqSchema,
  AdminPostOrderExchangesReqSchema,
} from "./validators"

export const adminExchangeRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/exchanges",
    middlewares: [
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
        AdminGetOrdersOrderParams,
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
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/inbound/items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
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
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/inbound/shipping-method/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
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
  },
  {
    method: ["POST"],
    matcher: "/admin/exchanges/:id/outbound/items/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostExhangesItemsActionReqSchema),
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
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
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
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/outbound/shipping-method/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
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
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id/request",
    middlewares: [],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/exchanges/:id",
    middlewares: [],
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
  },
]
