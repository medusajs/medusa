import * as QueryConfig from "./query-config"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { validateAndTransformQuery } from "../../utils/validate-query"
import {
  AdminCreateRegion,
  AdminGetRegionParams,
  AdminGetRegionsParams,
  AdminUpdateRegion,
} from "./validators"
import { validateAndTransformBody } from "../../utils/validate-body"

export const adminRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/regions",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRegionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/regions/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRegionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/regions",
    middlewares: [
      validateAndTransformBody(AdminCreateRegion),
      validateAndTransformQuery(
        AdminGetRegionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/regions/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateRegion),
      validateAndTransformQuery(
        AdminGetRegionParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
