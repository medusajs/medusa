import * as QueryConfig from "./query-config"

import { transformBody, transformQuery } from "../../../api/middlewares"
import {
  AdminGetRegionsParams,
  AdminGetRegionsRegionParams,
  AdminPostRegionsRegionReq,
  AdminPostRegionsReq,
} from "./validators"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/regions*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/regions",
    middlewares: [
      transformQuery(
        AdminGetRegionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/regions/:id",
    middlewares: [
      transformQuery(
        AdminGetRegionsRegionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/regions",
    middlewares: [
      transformQuery(
        AdminGetRegionsRegionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
      transformBody(AdminPostRegionsReq),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/regions/:id",
    middlewares: [
      transformQuery(
        AdminGetRegionsRegionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
      transformBody(AdminPostRegionsRegionReq),
    ],
  },
]
