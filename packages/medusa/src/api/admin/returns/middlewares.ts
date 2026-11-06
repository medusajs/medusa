import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminGetOrdersOrderParams,
  AdminGetOrdersParams,
  AdminGetReturnParams,
  AdminPostCancelReturnReqSchema,
  AdminPostReceiveReturnItemsReqSchema,
  AdminPostReceiveReturnsReqSchema,
  AdminPostReturnsConfirmRequestReqSchema,
  AdminPostReturnsReqSchema,
  AdminPostReturnsRequestItemsActionReqSchema,
  AdminPostReturnsRequestItemsReqSchema,
  AdminPostReturnsReturnReqSchema,
  AdminPostReturnsShippingActionReqSchema,
  AdminPostReturnsShippingReqSchema,
} from "./validators"

export const adminReturnRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/returns/*",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/returns",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
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
    matcher: "/admin/returns/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetReturnParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostReturnsReturnReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminPostReturnsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/request-items",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostReturnsRequestItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/request-items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostReturnsRequestItemsActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/returns/:id/request-items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
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
    method: ["POST"],
    matcher: "/admin/returns/:id/shipping-method",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostReturnsShippingReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/shipping-method/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostReturnsShippingActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/returns/:id/shipping-method/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
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
    method: ["POST"],
    matcher: "/admin/returns/:id/request",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostReturnsConfirmRequestReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/cancel",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostCancelReturnReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/returns/:id/request",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/receive",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostReceiveReturnsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/returns/:id/receive",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/receive/confirm",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.order,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostReturnsConfirmRequestReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/receive-items",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostReceiveReturnItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/receive-items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostReturnsRequestItemsActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/returns/:id/receive-items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
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
    method: ["POST"],
    matcher: "/admin/returns/:id/dismiss-items",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostReceiveReturnItemsReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/returns/:id/dismiss-items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminPostReturnsRequestItemsActionReqSchema),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/returns/:id/dismiss-items/:action_id",
    middlewares: [
      authorize([
        {
          resource: Entities.return,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
