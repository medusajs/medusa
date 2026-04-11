import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminDeleteClaimItemActionSchema,
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
    matcher: "/admin/claims/*",
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/claims",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.read,
      },
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.create,
      },
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id/claim-items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminDeleteClaimItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id/inbound/items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminDeleteClaimItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id/inbound/shipping-method/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminDeleteClaimItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id/outbound/items/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminDeleteClaimItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id/outbound/shipping-method/:action_id",
    middlewares: [
      validateAndTransformQuery(
        AdminDeleteClaimItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id/request",
    middlewares: [],
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.delete,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.delete,
      },
    ],
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
    policies: [
      {
        resource: Entities.order_claim,
        operation: PolicyOperation.update,
      },
    ],
  },
]
