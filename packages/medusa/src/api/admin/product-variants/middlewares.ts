import { validateAndTransformQuery } from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import { AdminGetProductVariantsParams } from "./validators"

export const adminProductVariantRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/product-variants/*",
    middlewares: [
      authorize([
        {
          resource: Entities.product_variant,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-variants",
    middlewares: [
      authorize([
        {
          resource: Entities.product_variant,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetProductVariantsParams,
        QueryConfig.listProductVariantQueryConfig
      ),
    ],
  },
]
