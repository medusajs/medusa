import * as QueryConfig from "./query-config"

import { AdminGetTaxRegionsParams, AdminPostTaxRegionsReq } from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminTaxRegionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/tax-regions*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: "POST",
    matcher: "/admin/tax-regions",
    middlewares: [transformBody(AdminPostTaxRegionsReq)],
  },
  {
    method: "GET",
    matcher: "/admin/tax-regions",
    middlewares: [
      transformQuery(
        AdminGetTaxRegionsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
]
