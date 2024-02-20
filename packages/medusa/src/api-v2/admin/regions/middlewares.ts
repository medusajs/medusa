import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import {
  AdminGetRegionsParams,
  AdminGetRegionsRegionParams,
  AdminPostRegionsRegionReq,
  AdminPostRegionsReq,
} from "./validators"

export const adminRegionRoutesMiddlewares: MiddlewareRoute[] = [
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
    middlewares: [transformBody(AdminPostRegionsReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/regions/:id",
    middlewares: [transformBody(AdminPostRegionsRegionReq)],
  },
]
