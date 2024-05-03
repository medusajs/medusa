import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
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
} from "./validators"

export const adminShippingProfilesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/shipping-profiles*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
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
