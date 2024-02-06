import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import {
  AdminGetWorkflowExecutionDetailsParams,
  AdminGetWorkflowExecutionsParams,
  AdminPostWorkflowsAsyncResponseReq,
  AdminPostWorkflowsRunReq,
} from "./validators"

export const adminWorkflowsMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/workflows/execution",
    middlewares: [
      transformQuery(
        AdminGetWorkflowExecutionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/workflows/:id/:transaction_id",
    middlewares: [
      transformQuery(
        AdminGetWorkflowExecutionDetailsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/workflows/:id/run",
    middlewares: [transformBody(AdminPostWorkflowsRunReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/workflows/:id/:transaction_id/:step_id/success",
    middlewares: [transformBody(AdminPostWorkflowsAsyncResponseReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/workflows/:id/:transaction_id/:step_id/failure",
    middlewares: [transformBody(AdminPostWorkflowsAsyncResponseReq)],
  },
]
