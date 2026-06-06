import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@zjedene-medusa/framework"
import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { PolicyOperation } from "@zjedene-medusa/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateShippingOptionType,
  AdminGetShippingOptionTypeParams,
  AdminGetShippingOptionTypesParams,
  AdminUpdateShippingOptionType,
} from "./validators"

export const adminShippingOptionTypeRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/shipping-option-types/*",
    policies: [
      {
        resource: Entities.shipping_option_type,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/shipping-option-types",
    middlewares: [
      validateAndTransformQuery(
        AdminGetShippingOptionTypesParams,
        QueryConfig.listShippingOptionTypesTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.shipping_option_type,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/shipping-option-types/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetShippingOptionTypeParams,
        QueryConfig.retrieveShippingOptionTypeTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-option-types",
    middlewares: [
      validateAndTransformBody(AdminCreateShippingOptionType),
      validateAndTransformQuery(
        AdminGetShippingOptionTypeParams,
        QueryConfig.retrieveShippingOptionTypeTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.shipping_option_type,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-option-types/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateShippingOptionType),
      validateAndTransformQuery(
        AdminGetShippingOptionTypeParams,
        QueryConfig.retrieveShippingOptionTypeTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.shipping_option_type,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/shipping-option-types/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.shipping_option_type,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
