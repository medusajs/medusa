import { Router } from "express"
import { Note, ReservationItemDTO } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, { transformBody } from "../../../middlewares"
import "reflect-metadata"
import { AdminPostReservationsReq } from "./create-reservation"
import { AdminPostReservationsReservationReq } from "./update-reservation"
import { checkRegisteredModules } from "../../../middlewares/check-registered-modules"

const route = Router()

export default (app) => {
  app.use(
    "/reservations",
    checkRegisteredModules({
      inventoryService:
        "Inventory is not enabled. Please add an Inventory module to enable this functionality.",
    }),
    route
  )

  route.get("/:id", middlewares.wrap(require("./get-reservation").default))

  route.post(
    "/",
    transformBody(AdminPostReservationsReq),
    middlewares.wrap(require("./create-reservation").default)
  )

  route.post(
    "/:id",
    transformBody(AdminPostReservationsReservationReq),
    middlewares.wrap(require("./update-reservation").default)
  )

  route.delete(
    "/:id",
    middlewares.wrap(require("./delete-reservation").default)
  )

  return app
}

/**
 * @schema AdminPostReservationsReq
 * type: object
 * required:
 *   - reservation
 * properties:
 *   reservation:
 *     $ref: "#/components/schemas/ReservationItemDTO"
 */
export type AdminReservationsRes = {
  reservation: ReservationItemDTO
}

/**
 * @schema AdminGetReservationReservationsReq
 * type: object
 * required:
 *   - reservation
 * properties:
 *   reservations:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ReservationItemDTO"
 */
export type AdminReservationsListRes = PaginatedResponse & {
  reservations: ReservationItemDTO[]
}

export type AdminReservationsDeleteRes = DeleteResponse

export * from "./create-reservation"
export * from "./delete-reservation"
export * from "./get-reservation"
export * from "./update-reservation"
