import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"

import * as QueryConfig from "./query-config"
import {
  AdminCreateSalesMaterial,
  AdminGetSalesMaterialParams,
  AdminGetSalesMaterialsParams,
  AdminUpdateSalesMaterial,
} from "./validators"

export const adminSalesMaterialRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/sales-materials",
    middlewares: [
      validateAndTransformQuery(
        AdminGetSalesMaterialsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/sales-materials/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetSalesMaterialParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-materials",
    middlewares: [
      validateAndTransformBody(AdminCreateSalesMaterial),
      validateAndTransformQuery(
        AdminGetSalesMaterialParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/sales-materials/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateSalesMaterial),
      validateAndTransformQuery(
        AdminGetSalesMaterialParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/sales-materials/:id",
    middlewares: [],
  },
]
