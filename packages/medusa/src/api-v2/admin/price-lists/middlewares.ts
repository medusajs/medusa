import { transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import * as ProductQueryConfig from "../products/query-config"
import { AdminGetProductsParams } from "../products/validators"
import * as QueryConfig from "./query-config"
import {
  AdminGetPriceListsParams,
  AdminGetPriceListsPriceListParams,
} from "./validators"

export const adminPriceListsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/products*",
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
    method: ["GET"],
    matcher: "/admin/price-lists/:id/products",
    middlewares: [
      transformQuery(
        AdminGetProductsParams,
        ProductQueryConfig.listTransformQueryConfig
      ),
    ],
  },
]
