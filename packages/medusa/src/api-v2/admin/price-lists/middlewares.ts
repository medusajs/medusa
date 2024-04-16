import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  AdminBatchPriceListPrices,
  AdminCreatePriceList,
  AdminGetPriceListParams,
  AdminGetPriceListPricesParams,
  AdminGetPriceListsParams,
  AdminUpdatePriceList,
} from "./validators"

export const adminPriceListsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/price-lists*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-lists",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPriceListsParams,
        QueryConfig.adminListTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-lists/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPriceListParams,
        QueryConfig.adminRetrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists",
    middlewares: [
      validateAndTransformBody(AdminCreatePriceList),
      validateAndTransformQuery(
        AdminGetPriceListPricesParams,
        QueryConfig.retrivePriceListPriceQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdatePriceList),
      validateAndTransformQuery(
        AdminGetPriceListPricesParams,
        QueryConfig.retrivePriceListPriceQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id/prices/batch",
    middlewares: [
      validateAndTransformBody(AdminBatchPriceListPrices),
      validateAndTransformQuery(
        AdminGetPriceListPricesParams,
        QueryConfig.listPriceListPriceQueryConfig
      ),
    ],
  },
]
