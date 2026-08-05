import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateProductOption,
  AdminGetProductOptionParams,
  AdminGetProductOptionsParams,
  AdminGetProductOptionValueParams,
  AdminGetProductOptionValuesParams,
  AdminUpdateProductOption,
  AdminUpdateProductOptionValue,
} from "./validators"

export const adminProductOptionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/product-options/*",
    middlewares: [
      authorize([
        {
          resource: Entities.product_option,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-options",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductOptionsParams,
        QueryConfig.listProductOptionsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-options/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductOptionParams,
        QueryConfig.retrieveProductOptionsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/product-options",
    middlewares: [
      authorize([
        {
          resource: Entities.product_option,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateProductOption),
      validateAndTransformQuery(
        AdminGetProductOptionParams,
        QueryConfig.retrieveProductOptionsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/product-options/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.product_option,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateProductOption),
      validateAndTransformQuery(
        AdminGetProductOptionParams,
        QueryConfig.retrieveProductOptionsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/product-options/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.product_option,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-options/:id/values",
    middlewares: [
      authorize([
        {
          resource: Entities.product_option,
          operation: PolicyOperation.read,
        },
        {
          resource: Entities.product_option_value,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetProductOptionValuesParams,
        QueryConfig.listProductOptionValuesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-options/:id/values/:value_id",
    middlewares: [
      authorize([
        {
          resource: Entities.product_option_value,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetProductOptionValueParams,
        QueryConfig.retrieveProductOptionValuesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/product-options/:id/values/:value_id",
    middlewares: [
      authorize([
        {
          resource: Entities.product_option,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.product_option_value,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateProductOptionValue),
      validateAndTransformQuery(
        AdminGetProductOptionValueParams,
        QueryConfig.retrieveProductOptionValuesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/product-options/:id/values/:value_id",
    middlewares: [
      authorize([
        {
          resource: Entities.product_option,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.product_option_value,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
]
