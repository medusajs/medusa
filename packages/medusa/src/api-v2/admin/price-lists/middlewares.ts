import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import {
  AdminGetPriceListsParams,
  AdminGetPriceListsPriceListParams,
  AdminPostPriceListsPriceListReq,
  AdminPostPriceListsReq,
} from "./validators"

export const adminPriceListsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/price-lists",
    middlewares: [
      transformQuery(
        AdminGetPriceListsParams,
        QueryConfig.adminListTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-lists/:id",
    middlewares: [
      transformQuery(
        AdminGetPriceListsPriceListParams,
        QueryConfig.adminRetrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists",
    middlewares: [transformBody(AdminPostPriceListsReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id",
    middlewares: [transformBody(AdminPostPriceListsPriceListReq)],
  },
]
