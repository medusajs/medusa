import { transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import * as QueryConfig from "./query-config"
import {
  AdminGetPriceListsParams,
  AdminGetPriceListsPriceListParams,
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
]
