import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/authenticate-middleware"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  AdminCreateFulfillmentSetServiceZonesSchema,
  AdminFulfillmentSetParams
} from "./validators"

export const adminFulfillmentSetsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/admin/fulfillment-sets*",
    middlewares: [authenticate("admin", ["session", "bearer", "api-key"])],
  },
  {
    method: ["POST"],
    matcher: "/admin/fulfillment-sets/:id/service-zones",
    middlewares: [
      validateAndTransformBody(AdminCreateFulfillmentSetServiceZonesSchema),
      validateAndTransformQuery(
        AdminFulfillmentSetParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
