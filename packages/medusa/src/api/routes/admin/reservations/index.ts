import { ReservationItemDTO } from "@medusajs/types"
import { Router } from "express"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { checkRegisteredModules } from "../../../middlewares/check-registered-modules"
import { AdminPostReservationsReq } from "./create-reservation"
import { AdminGetReservationsParams } from "./list-reservations"
import { AdminPostReservationsReservationReq } from "./update-reservation"

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

  route.get(
    "/",
    transformQuery(AdminGetReservationsParams, {
      defaultFields: defaultReservationFields,
      defaultRelations: defaultAdminReservationRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-reservations").default)
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
 * @schema AdminReservationsRes
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
 * @schema AdminReservationsListRes
 * type: object
 * required:
 *   - reservations
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   reservations:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ReservationItemDTO"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of items skipped before these items
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminReservationsListRes = PaginatedResponse & {
  reservations: ReservationItemDTO[]
}

export const defaultAdminReservationRelations = []

export const defaultReservationFields = [
  "id",
  "location_id",
  "inventory_item_id",
  "quantity",
  "line_item_id",
  "metadata",
  "created_at",
  "updated_at",
]

/**
 * @schema AdminReservationsDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Reservation.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: reservation
 *   deleted:
 *     type: boolean
 *     description: Whether or not the Reservation was deleted.
 *     default: true
 */
export type AdminReservationsDeleteRes = DeleteResponse

export * from "./create-reservation"
export * from "./delete-reservation"
export * from "./get-reservation"
export * from "./list-reservations"
export * from "./update-reservation"
