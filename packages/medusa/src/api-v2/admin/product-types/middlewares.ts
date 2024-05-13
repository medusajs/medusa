import * as QueryConfig from "./query-config"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformQuery } from "../../utils/validate-query"
import {
  AdminCreateProductType,
  AdminGetProductTypeParams,
  AdminGetProductTypesParams,
  AdminUpdateProductType,
} from "./validators"
import { validateAndTransformBody } from "../../utils/validate-body"

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
      validateAndTransformQuery(
        AdminGetProductTypesParams,
        QueryConfig.listProductTypesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-types/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductTypeParams,
        QueryConfig.retrieveProductTypeTransformQueryConfig
      ),
    ],
  },
  // Create/update/delete methods are new in v2
  {
    method: ["POST"],
    matcher: "/admin/product-types",
    middlewares: [
      validateAndTransformBody(AdminCreateProductType),
      validateAndTransformQuery(
        AdminGetProductTypeParams,
        QueryConfig.retrieveProductTypeTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/product-types/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateProductType),
      validateAndTransformQuery(
        AdminGetProductTypeParams,
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
