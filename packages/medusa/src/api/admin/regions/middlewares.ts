import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@zjedene-medusa/framework"
import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { PolicyOperation } from "@zjedene-medusa/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateRegion,
  AdminGetRegionParams,
  AdminGetRegionsParams,
  AdminUpdateRegion,
} from "./validators"

export const adminRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/regions/*",
    policies: [
      {
        resource: Entities.region,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/regions",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRegionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.region,
        operation: PolicyOperation.read,
      },
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
    policies: [
      {
        resource: Entities.region,
        operation: PolicyOperation.create,
      },
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
    policies: [
      {
        resource: Entities.region,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/regions/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.region,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
