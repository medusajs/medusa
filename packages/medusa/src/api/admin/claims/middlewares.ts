import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
    middlewares: [
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/claims",
    middlewares: [
      authorize([
        {
          resource: Entities.order_claim,
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
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.create,
        },
      ]),
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
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminDeleteClaimItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/claims/:id/inbound/items",
    middlewares: [
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminDeleteClaimItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/inbound/shipping-method",
    middlewares: [
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminDeleteClaimItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },

  {
    method: ["POST"],
    matcher: "/admin/claims/:id/outbound/items",
    middlewares: [
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminDeleteClaimItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/outbound/shipping-method",
    middlewares: [
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminDeleteClaimItemActionSchema,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/request",
    middlewares: [
      authorize([
        {
          resource: Entities.order_claim,
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
    matcher: "/admin/claims/:id/request",
    middlewares: [
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/claims/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/claims/:id/cancel",
    middlewares: [
      authorize([
        {
          resource: Entities.order_claim,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostCancelClaimReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
