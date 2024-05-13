import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import { createLinkBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import {
  AdminCreateProductCategory,
  AdminProductCategoriesParams,
  AdminProductCategoryParams,
  AdminUpdateProductCategory,
} from "./validators"

export const adminProductCategoryRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/product-categories*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-categories",
    middlewares: [
      validateAndTransformQuery(
        AdminProductCategoriesParams,
        QueryConfig.listProductCategoryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-categories/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminProductCategoryParams,
        QueryConfig.retrieveProductCategoryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/product-categories",
    middlewares: [
      validateAndTransformBody(AdminCreateProductCategory),
      validateAndTransformQuery(
        AdminProductCategoryParams,
        QueryConfig.retrieveProductCategoryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/product-categories/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateProductCategory),
      validateAndTransformQuery(
        AdminProductCategoryParams,
        QueryConfig.retrieveProductCategoryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/product-categories/:id/products",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminProductCategoryParams,
        QueryConfig.retrieveProductCategoryConfig
      ),
    ],
  },
]
