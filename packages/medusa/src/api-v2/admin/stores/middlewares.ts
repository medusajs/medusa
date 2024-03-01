import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import * as QueryConfig from "./query-config"
import {
  AdminGetStoresParams,
  AdminGetStoresStoreParams,
  AdminPostStoresStoreReq,
} from "./validators"

export const adminStoreRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/stores*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/stores",
    middlewares: [
      transformQuery(
        AdminGetStoresParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/stores/:id",
    middlewares: [
      transformQuery(
        AdminGetStoresStoreParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/stores/:id",
    middlewares: [transformBody(AdminPostStoresStoreReq)],
  },
]
