import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import { createBatchBody, createLinkBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import {
  AdminCreatePriceList,
  AdminCreatePriceListPrice,
  AdminGetPriceListParams,
  AdminGetPriceListPricesParams,
  AdminGetPriceListsParams,
  AdminUpdatePriceList,
  AdminUpdatePriceListPrice,
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
        QueryConfig.listPriceListQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/price-lists/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPriceListParams,
        QueryConfig.retrivePriceListQueryConfig
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
        QueryConfig.retrivePriceListQueryConfig
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
        QueryConfig.retrivePriceListQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id/products",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetPriceListParams,
        QueryConfig.listPriceListQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/price-lists/:id/prices/batch",
    middlewares: [
      validateAndTransformBody(
        createBatchBody(AdminCreatePriceListPrice, AdminUpdatePriceListPrice)
      ),
      validateAndTransformQuery(
        AdminGetPriceListPricesParams,
        QueryConfig.listPriceListPriceQueryConfig
      ),
    ],
  },
]
