import { MiddlewareRoute } from "@medusajs/framework/http"
import { maybeApplyLinkFilter } from "../../utils/maybe-apply-link-filter"
import { validateAndTransformBody } from "@medusajs/framework"
import { validateAndTransformQuery } from "@medusajs/framework"
import { createBatchBody } from "../../utils/validators"
import {
  listTransformQueryConfig,
  retrieveRuleTransformQueryConfig,
  retrieveTransformQueryConfig,
} from "./query-config"
import {
  AdminCreateShippingOption,
  AdminCreateShippingOptionRule,
  AdminGetShippingOptionParams,
  AdminGetShippingOptionRuleParams,
  AdminGetShippingOptionsParams,
  AdminUpdateShippingOption,
  AdminUpdateShippingOptionRule,
} from "./validators"

export const adminShippingOptionRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/shipping-options",
    middlewares: [
      validateAndTransformQuery(
        AdminGetShippingOptionsParams,
        listTransformQueryConfig
      ),
      maybeApplyLinkFilter({
        entryPoint: "location_fulfillment_set",
        resourceId: "fulfillment_set_id",
        filterableField: "stock_location_id",
        filterByField: "service_zone.fulfillment_set_id",
      }),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/shipping-options/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetShippingOptionParams,
        retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-options",
    middlewares: [
      validateAndTransformBody(AdminCreateShippingOption),
      validateAndTransformQuery(
        AdminGetShippingOptionParams,
        retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateShippingOption),
      validateAndTransformQuery(
        AdminGetShippingOptionParams,
        retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/shipping-options/:id",
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id/rules/batch",
    middlewares: [
      validateAndTransformBody(
        createBatchBody(
          AdminCreateShippingOptionRule,
          AdminUpdateShippingOptionRule
        )
      ),
      validateAndTransformQuery(
        AdminGetShippingOptionRuleParams,
        retrieveRuleTransformQueryConfig
      ),
    ],
  },
]
