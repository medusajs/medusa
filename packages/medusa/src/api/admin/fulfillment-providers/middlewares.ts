import { MiddlewareRoute } from "../../../types/middlewares"
import { maybeApplyLinkFilter } from "../../utils/maybe-apply-link-filter"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import { AdminFulfillmentProvidersParams } from "./validators"

export const adminFulfillmentProvidersRoutesMiddlewares: MiddlewareRoute[] = [
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
  },
]
