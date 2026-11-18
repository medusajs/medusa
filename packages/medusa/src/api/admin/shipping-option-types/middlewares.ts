import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
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
    middlewares: [
      authorize([
        {
          resource: Entities.shipping_option_type,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/shipping-option-types",
    middlewares: [
      authorize([
        {
          resource: Entities.shipping_option_type,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetShippingOptionTypesParams,
        QueryConfig.listShippingOptionTypesTransformQueryConfig
      ),
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
      authorize([
        {
          resource: Entities.shipping_option_type,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateShippingOptionType),
      validateAndTransformQuery(
        AdminGetShippingOptionTypeParams,
        QueryConfig.retrieveShippingOptionTypeTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-option-types/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.shipping_option_type,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateShippingOptionType),
      validateAndTransformQuery(
        AdminGetShippingOptionTypeParams,
        QueryConfig.retrieveShippingOptionTypeTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/shipping-option-types/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.shipping_option_type,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
]
