import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  AdminCreateReturnReason,
  AdminGetReturnReasonsParams,
  AdminGetReturnReasonsReturnReasonParams,
} from "./validators"

export const adminReturnReasonRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/return-reasons*",
    middlewares: [authenticate("user", ["bearer", "session", "api-key"])],
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
  },
  {
    method: ["DELETE"],
    matcher: "/admin/return-reasons/:id",
  },
]
