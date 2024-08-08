import { MiddlewareRoute } from "@medusajs/framework"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import { AdminGetProductVariantsParams } from "./validators"

export const adminProductVariantRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/product-variants",
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductVariantsParams,
        QueryConfig.listProductVariantQueryConfig
      ),
    ],
  },
]
