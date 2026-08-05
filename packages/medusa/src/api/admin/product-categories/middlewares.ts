import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { createLinkBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateProductCategory,
  AdminProductCategoriesParams,
  AdminProductCategoryParams,
  AdminUpdateProductCategory,
} from "./validators"

export const adminProductCategoryRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/product-categories/*",
    middlewares: [
      authorize([
        {
          resource: Entities.product_category,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-categories",
    middlewares: [
      authorize([
        {
          resource: Entities.product_category,
          operation: PolicyOperation.read,
        },
      ]),
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
      authorize([
        {
          resource: Entities.product_category,
          operation: PolicyOperation.create,
        },
      ]),
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
      authorize([
        {
          resource: Entities.product_category,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateProductCategory),
      validateAndTransformQuery(
        AdminProductCategoryParams,
        QueryConfig.retrieveProductCategoryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/product-categories/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.product_category,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/product-categories/:id/products",
    middlewares: [
      authorize([
        {
          resource: Entities.product_category,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.product,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminProductCategoryParams,
        QueryConfig.retrieveProductCategoryConfig
      ),
    ],
  },
]
