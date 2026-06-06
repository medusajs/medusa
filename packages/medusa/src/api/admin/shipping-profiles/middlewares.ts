import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@zjedene-medusa/framework"
import { MiddlewareRoute } from "@zjedene-medusa/framework/http"
import { PolicyOperation } from "@zjedene-medusa/framework/utils"
import {
  Entities,
  listTransformQueryConfig,
  retrieveTransformQueryConfig,
} from "./query-config"
import {
  AdminCreateShippingProfile,
  AdminGetShippingProfileParams,
  AdminGetShippingProfilesParams,
  AdminUpdateShippingProfile,
} from "./validators"

export const adminShippingProfilesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/shipping-profiles/*",
    policies: [
      {
        resource: Entities.shipping_profile,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-profiles",
    middlewares: [
      validateAndTransformBody(AdminCreateShippingProfile),
      validateAndTransformQuery(
        AdminGetShippingProfilesParams,
        retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.shipping_profile,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/shipping-profiles",
    middlewares: [
      validateAndTransformQuery(
        AdminGetShippingProfilesParams,
        listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.shipping_profile,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/shipping-profiles/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateShippingProfile),
      validateAndTransformQuery(
        AdminGetShippingProfileParams,
        retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.shipping_profile,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/shipping-profiles/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetShippingProfileParams,
        retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/shipping-profiles/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.shipping_profile,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
