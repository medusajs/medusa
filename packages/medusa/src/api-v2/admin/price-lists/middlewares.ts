import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import * as QueryConfig from "./query-config"
import {
  AdminGetPriceListsParams,
  AdminGetPriceListsPriceListParams,
  AdminPostPriceListsPriceListPricesBatchAddReq,
  AdminPostPriceListsPriceListPricesBatchRemoveReq,
  AdminPostPriceListsPriceListReq,
  AdminPostPriceListsReq,
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
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id/prices/batch/add",
    middlewares: [transformBody(AdminPostPriceListsPriceListPricesBatchAddReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id/prices/batch/remove",
    middlewares: [
      transformBody(AdminPostPriceListsPriceListPricesBatchRemoveReq),
    ],
  },
]
