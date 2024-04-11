import * as QueryConfig from "./query-config"

import {
  AdminGetReservationsParams,
  AdminGetReservationsReservationParams,
  AdminPostReservationsReq,
  AdminPostReservationsReservationReq,
} from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminReservationRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/reservations*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/reservations",
    middlewares: [
      transformQuery(
        AdminGetReservationsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/reservations/:id",
    middlewares: [
      transformQuery(
        AdminGetReservationsReservationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/reservations",
    middlewares: [
      transformQuery(
        AdminGetReservationsReservationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
      transformBody(AdminPostReservationsReq),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/reservations/:id",
    middlewares: [
      transformQuery(
        AdminGetReservationsReservationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
      transformBody(AdminPostReservationsReservationReq),
    ],
  },
]
