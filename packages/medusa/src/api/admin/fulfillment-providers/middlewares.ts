import { validateAndTransformQuery } from "@medusajs/framework"
import {
  authorize,
  maybeApplyLinkFilter,
  MiddlewareRoute,
} from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import { AdminFulfillmentProvidersParams } from "./validators"

export const adminFulfillmentProvidersRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/fulfillment-providers/*",
    middlewares: [
      authorize([
        {
          resource: Entities.fulfillment_provider,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/fulfillment-providers",
    middlewares: [
      authorize([
        {
          resource: Entities.fulfillment_provider,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminFulfillmentProvidersParams,
        QueryConfig.listTransformQueryConfig
      ),
      maybeApplyLinkFilter({
        entryPoint: "location_fulfillment_provider",
        resourceId: "fulfillment_provider_id",
        filterableField: "stock_location_id",
      }),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/fulfillment-providers/:id/options",
    middlewares: [],
  },
]
