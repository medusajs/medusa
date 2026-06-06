import { validateAndTransformQuery } from "@zjedene-medusa/framework"
import { maybeApplyLinkFilter, MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { PolicyOperation } from "@zjedene-medusa/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import { AdminFulfillmentProvidersParams } from "./validators"

export const adminFulfillmentProvidersRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/fulfillment-providers/*",
    policies: [
      {
        resource: Entities.fulfillment_provider,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/fulfillment-providers",
    middlewares: [
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
    policies: [
      {
        resource: Entities.fulfillment_provider,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/fulfillment-providers/:id/options",
    middlewares: [],
  },
]
