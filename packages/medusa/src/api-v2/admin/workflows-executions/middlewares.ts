import * as QueryConfig from "./query-config"

import {
  AdminGetWorkflowExecutionDetailsParams,
  AdminGetWorkflowExecutionsParams,
  AdminPostWorkflowsAsyncResponseReq,
  AdminPostWorkflowsRunReq,
} from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminWorkflowsExecutionsMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/workflows-executions*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/workflows-executions",
    middlewares: [
      transformQuery(
        AdminGetWorkflowExecutionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/workflows-executions/:id",
    middlewares: [
      transformQuery(
        AdminGetWorkflowExecutionDetailsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/workflows-executions/:workflow_id/:transaction_id",
    middlewares: [
      transformQuery(
        AdminGetWorkflowExecutionDetailsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/workflows-executions/:id/run",
    middlewares: [transformBody(AdminPostWorkflowsRunReq)],
  },
  {
    method: ["POST"],

    matcher: "/admin/workflows-executions/:id/steps/success",
    middlewares: [transformBody(AdminPostWorkflowsAsyncResponseReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/workflows-executions/:id/steps/failure",
    middlewares: [transformBody(AdminPostWorkflowsAsyncResponseReq)],
  },
]
