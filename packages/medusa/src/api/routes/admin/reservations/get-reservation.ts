import { MedusaError } from "medusa-core-utils"
import { IInventoryService } from "../../../../interfaces"

/**
 * @oas [get] /reservations/{id}
 * operationId: "GetReservationsReservation"
 * summary: "Get a Reservation"
 * description: "Retrieves a single reservation using its id"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the reservation to retrieve.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.reservations.retrieve(reservation_id)
 *       .then(({ reservation }) => {
 *         console.log(reservation.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/reservations/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Reservation
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPostReservationsReq"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params
  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const [reservations, count] = await inventoryService.listReservationItems({
    id,
  })

  if (!count) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Reservation with id ${id} not found`
    )
  }

  res.status(200).json({ reservation: reservations[0] })
}
