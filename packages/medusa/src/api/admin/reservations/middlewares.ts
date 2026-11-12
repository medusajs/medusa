import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
    middlewares: [
      authorize([
        {
          resource: Entities.reservation_item,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/reservations",
    middlewares: [
      authorize([
        {
          resource: Entities.reservation_item,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetReservationsParams,
        QueryConfig.listTransformQueryConfig
      ),
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
      authorize([
        {
          resource: Entities.reservation_item,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateReservation),
      validateAndTransformQuery(
        AdminGetReservationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/reservations/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.reservation_item,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateReservation),
      validateAndTransformQuery(
        AdminGetReservationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/reservations/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.reservation_item,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
]
