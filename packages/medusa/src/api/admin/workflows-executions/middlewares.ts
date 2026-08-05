import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"

import {
  AdminCreateWorkflowsAsyncResponse,
  AdminCreateWorkflowsRun,
  AdminGetWorkflowExecutionDetailsParams,
  AdminGetWorkflowExecutionsParams,
} from "./validators"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"

export const adminWorkflowsExecutionsMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/workflows-executions/*",
    middlewares: [
      authorize([
        {
          resource: Entities.workflow_execution,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/workflows-executions",
    middlewares: [
      authorize([
        {
          resource: Entities.workflow_execution,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetWorkflowExecutionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/workflows-executions/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetWorkflowExecutionDetailsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/workflows-executions/:workflow_id/:transaction_id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetWorkflowExecutionDetailsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/workflows-executions/:workflow_id/run",
    middlewares: [
      authorize([
        {
          resource: Entities.workflow_execution,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateWorkflowsRun),
    ],
  },
  {
    method: ["POST"],

    matcher: "/admin/workflows-executions/:workflow_id/steps/success",
    middlewares: [
      authorize([
        {
          resource: Entities.workflow_execution,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminCreateWorkflowsAsyncResponse),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/workflows-executions/:workflow_id/steps/failure",
    middlewares: [
      authorize([
        {
          resource: Entities.workflow_execution,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminCreateWorkflowsAsyncResponse),
    ],
  },
]
