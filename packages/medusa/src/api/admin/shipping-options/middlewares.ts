import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { maybeApplyLinkFilter, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT } from "../../../utils/middlewares"
import { createBatchBody } from "../../utils/validators"
import {
  Entities,
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
    matcher: "/admin/shipping-options/*",
    policies: [
      {
        resource: Entities.shipping_option,
        operation: PolicyOperation.read,
      },
    ],
  },
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
    policies: [
      {
        resource: Entities.shipping_option,
        operation: PolicyOperation.read,
      },
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
    policies: [
      {
        resource: Entities.shipping_option,
        operation: PolicyOperation.create,
      },
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
    policies: [
      {
        resource: Entities.shipping_option,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/shipping-options/:id",
    policies: [
      {
        resource: Entities.shipping_option,
        operation: PolicyOperation.delete,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id/rules/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
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
    policies: [
      {
        resource: Entities.shipping_option,
        operation: PolicyOperation.update,
      },
    ],
  },
]
