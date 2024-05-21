import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import * as QueryConfig from "./query-config"
import {
  AdminCancelFulfillment,
  AdminCreateFulfillment,
  AdminCreateShipment,
  AdminFulfillmentParams,
} from "./validators"

export const adminFulfillmentsRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/admin/fulfillments*",
    middlewares: [authenticate("admin", ["session", "bearer", "api-key"])],
  },
  {
    method: ["POST"],
    matcher: "/admin/fulfillments/:id/cancel",
    middlewares: [
      validateAndTransformBody(AdminCancelFulfillment),
      validateAndTransformQuery(
        AdminFulfillmentParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/fulfillments",
    middlewares: [
      validateAndTransformBody(AdminCreateFulfillment),
      validateAndTransformQuery(
        AdminFulfillmentParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/fulfillments/:id/shipment",
    middlewares: [
      validateAndTransformBody(AdminCreateShipment),
      validateAndTransformQuery(
        AdminFulfillmentParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
