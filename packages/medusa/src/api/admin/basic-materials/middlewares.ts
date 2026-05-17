import * as QueryConfig from "./query-config"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  AdminCreateBasicMaterial,
  AdminGetBasicMaterialParams,
  AdminGetBasicMaterialsParams,
  AdminUpdateBasicMaterial,
} from "./validators"

export const adminBasicMaterialRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/basic-materials",
    middlewares: [
      validateAndTransformQuery(
        AdminGetBasicMaterialsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/basic-materials/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetBasicMaterialParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/basic-materials",
    middlewares: [
      validateAndTransformBody(AdminCreateBasicMaterial),
      validateAndTransformQuery(
        AdminGetBasicMaterialParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/basic-materials/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateBasicMaterial),
      validateAndTransformQuery(
        AdminGetBasicMaterialParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/basic-materials/:id",
    middlewares: [],
  },
]
