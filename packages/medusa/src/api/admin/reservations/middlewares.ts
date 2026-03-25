import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import {
  AdminCreateReservation,
  AdminGetReservationParams,
  AdminGetReservationsParams,
  AdminUpdateReservation,
} from "./validators"

export const adminReservationRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/reservations/*",
    policies: [
      {
        resource: Entities.reservation_item,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/reservations",
    middlewares: [
      validateAndTransformQuery(
        AdminGetReservationsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.reservation_item,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/reservations/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetReservationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/reservations",
    middlewares: [
      validateAndTransformBody(AdminCreateReservation),
      validateAndTransformQuery(
        AdminGetReservationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.reservation_item,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/reservations/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateReservation),
      validateAndTransformQuery(
        AdminGetReservationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.reservation_item,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/reservations/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.reservation_item,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
