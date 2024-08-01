import { MiddlewareRoute } from "@medusajs/framework"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  AdminGetOrdersOrderParams,
  AdminGetOrdersParams,
  AdminPostCancelClaimReqSchema,
  AdminPostClaimItemsReqSchema,
  AdminPostClaimsAddItemsReqSchema,
  AdminPostClaimsRequestItemsActionReqSchema,
  AdminPostClaimsRequestReturnItemsReqSchema,
  AdminPostClaimsShippingActionReqSchema,
  AdminPostClaimsShippingReqSchema,
  AdminPostOrderClaimsReqSchema,
} from "./validators"

export const adminClaimRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/claims",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/claims/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims",
    middlewares: [
      validateAndTransformBody(AdminPostOrderClaimsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/claims/:id/claim-items",
    middlewares: [
      validateAndTransformBody(AdminPostClaimItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/claim-items/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostClaimsRequestItemsActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id/claim-items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/claims/:id/inbound/items",
    middlewares: [
      validateAndTransformBody(AdminPostClaimsRequestReturnItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/inbound/items/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostClaimsRequestItemsActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id/inbound/items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/inbound/shipping-method",
    middlewares: [
      validateAndTransformBody(AdminPostClaimsShippingReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/inbound/shipping-method/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostClaimsShippingActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id/inbound/shipping-method/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/claims/:id/outbound/items",
    middlewares: [
      validateAndTransformBody(AdminPostClaimsAddItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/outbound/items/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostClaimsRequestItemsActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id/outbound/items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/outbound/shipping-method",
    middlewares: [
      validateAndTransformBody(AdminPostClaimsShippingReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/outbound/shipping-method/:action_id",
    middlewares: [
      validateAndTransformBody(AdminPostClaimsShippingActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id/outbound/shipping-method/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/request",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id/request",
    middlewares: [],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/cancel",
    middlewares: [
      validateAndTransformBody(AdminPostCancelClaimReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
