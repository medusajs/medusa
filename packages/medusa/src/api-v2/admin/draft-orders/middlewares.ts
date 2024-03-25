import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import * as QueryConfig from "./query-config"
import {
  AdminGetOrdersOrderParams,
  AdminGetOrdersParams,
  AdminPostDraftOrdersReq,
} from "./validators"

export const adminDraftOrderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/draft-orders*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/draft-orders",
    middlewares: [
      transformQuery(
        AdminGetOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/draft-orders/:id",
    middlewares: [
      transformQuery(
        AdminGetOrdersOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders",
    middlewares: [transformBody(AdminPostDraftOrdersReq)],
  },
]
