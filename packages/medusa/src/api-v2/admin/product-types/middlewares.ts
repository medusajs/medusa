import * as QueryConfig from "./query-config"

import {
  AdminGetProductTypesProductTypeParams,
  AdminGetProductTypesParams,
  AdminPostProductTypesProductTypeReq,
  AdminPostProductTypesReq,
} from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminProductTypeRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/product-types/*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },

  {
    method: ["GET"],
    matcher: "/admin/product-types",
    middlewares: [
      transformQuery(
        AdminGetProductTypesParams,
        QueryConfig.listProductTypesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-types/:id",
    middlewares: [
      transformQuery(
        AdminGetProductTypesProductTypeParams,
        QueryConfig.retrieveProductTypeTransformQueryConfig
      ),
    ],
  },
  // Create/update/delete methods are new in v2
  {
    method: ["POST"],
    matcher: "/admin/product-types",
    middlewares: [
      transformBody(AdminPostProductTypesReq),
      transformQuery(
        AdminGetProductTypesParams,
        QueryConfig.retrieveProductTypeTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/product-types/:id",
    middlewares: [
      transformBody(AdminPostProductTypesProductTypeReq),
      transformQuery(
        AdminGetProductTypesProductTypeParams,
        QueryConfig.retrieveProductTypeTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/product-types/:id",
    middlewares: [],
  },
]
