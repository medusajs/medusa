import { validateAndTransformQuery } from "@zjedene-medusa/framework"
import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { PolicyOperation } from "@zjedene-medusa/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import { AdminGetProductVariantsParams } from "./validators"

export const adminProductVariantRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/product-variants/*",
    policies: [
      {
        resource: Entities.product_variant,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/product-variants",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductVariantsParams,
        QueryConfig.listProductVariantQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.product_variant,
        operation: PolicyOperation.read,
      },
    ],
  },
]
