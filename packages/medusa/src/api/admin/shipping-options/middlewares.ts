import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import {
  authorize,
  maybeApplyLinkFilter,
  MiddlewareRoute,
} from "@medusajs/framework/http"
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
    middlewares: [
      authorize([
        {
          resource: Entities.shipping_option,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/shipping-options",
    middlewares: [
      authorize([
        {
          resource: Entities.shipping_option,
          operation: PolicyOperation.read,
        },
      ]),
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
      authorize([
        {
          resource: Entities.shipping_option,
          operation: PolicyOperation.create,
        },
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.shipping_option,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.update,
        },
      ]),
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
    middlewares: [
      authorize([
        {
          resource: Entities.shipping_option,
          operation: PolicyOperation.delete,
        },
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.update,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-options/:id/rules/batch",
    bodyParser: {
      sizeLimit: DEFAULT_BATCH_ENDPOINTS_SIZE_LIMIT,
    },
    middlewares: [
      authorize([
        {
          resource: Entities.shipping_option,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.stock_location,
          operation: PolicyOperation.update,
        },
      ]),
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
