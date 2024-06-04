import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import {
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
    method: ["POST"],
    matcher: "/admin/shipping-profiles",
    middlewares: [
      validateAndTransformBody(AdminCreateShippingProfile),
      validateAndTransformQuery(
        AdminGetShippingProfilesParams,
        retrieveTransformQueryConfig
      ),
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
]
