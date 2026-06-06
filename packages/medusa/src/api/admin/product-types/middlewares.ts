import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@zjedene-medusa/framework"
import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { PolicyOperation } from "@zjedene-medusa/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateProductType,
  AdminGetProductTypeParams,
  AdminGetProductTypesParams,
  AdminUpdateProductType,
} from "./validators"

export const adminProductTypeRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/product-types/*",
    policies: [
      {
        resource: Entities.product_type,
        operation: PolicyOperation.read,
      },
    ],
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
    policies: [
      {
        resource: Entities.product_type,
        operation: PolicyOperation.read,
      },
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
    policies: [
      {
        resource: Entities.product_type,
        operation: PolicyOperation.create,
      },
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
    policies: [
      {
        resource: Entities.product_type,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/product-types/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.product_type,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
