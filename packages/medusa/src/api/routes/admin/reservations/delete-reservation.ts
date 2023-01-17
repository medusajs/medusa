import { EntityManager } from "typeorm"
import { IInventoryService } from "../../../../interfaces"

/**
 * @oas [delete] /reservations/{id}
 * operationId: "DeleteReservationsReservation"
 * summary: "Delete a Reservation"
 * description: "Deletes a Reservation."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Reservation to delete.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.reservations.delete(reservation.id)
 *       .then(({ id, object, deleted }) => {
 *         console.log(id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/reservations/{id}' \
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
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted Reservation.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: reservation
 *             deleted:
 *               type: boolean
 *               description: Whether or not the Reservation was deleted.
 *               default: true
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
  const inventoryService: IInventoryService = req.resolve("inventoryService")
  const manager: EntityManager = req.resolve("manager")

  await manager.transaction(async (manager) => {
    await inventoryService.withTransaction(manager).deleteReservationItem(id)
  })

  res.json({
    id,
    object: "reservation",
    deleted: true,
  })
}
