import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateReturnReason,
  AdminGetReturnReasonsParams,
  AdminGetReturnReasonsReturnReasonParams,
  AdminUpdateReturnReason,
} from "./validators"

export const adminReturnReasonRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/return-reasons/*",
    policies: [
      {
        resource: Entities.return_reason,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/return-reasons",
    middlewares: [
      validateAndTransformQuery(
        AdminGetReturnReasonsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.return_reason,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/return-reasons/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetReturnReasonsReturnReasonParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/return-reasons",
    middlewares: [
      validateAndTransformBody(AdminCreateReturnReason),
      validateAndTransformQuery(
        AdminGetReturnReasonsReturnReasonParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.return_reason,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/return-reasons/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateReturnReason),
      validateAndTransformQuery(
        AdminGetReturnReasonsReturnReasonParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.return_reason,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/return-reasons/:id",
    policies: [
      {
        resource: Entities.return_reason,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
