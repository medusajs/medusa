import { IsNumber, IsObject, IsOptional, IsString } from "class-validator"
import { EntityManager } from "typeorm"
import { IInventoryService } from "../../../../interfaces"

/**
 * @oas [post] /reservations/{id}
 * operationId: "PostReservationsReservation"
 * summary: "Updates a Reservation"
 * description: "Updates a Reservation which can be associated with any resource as required."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Reservation to update.
 * requestBody:
 *  content:
 *    application/json:
 *      schema:
 *        $ref: "#/components/schemas/AdminPostReservationsReservationReq"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.reservations.update(reservation.id, {
 *         quantity: 3
 *       })
 *       .then(({ reservations }) => {
 *         console.log(reservations.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/reservations/{id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *          "quantity": 3,
 *       }'
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
  const { validatedBody } = req as {
    validatedBody: AdminPostReservationsReservationReq
  }

  const manager: EntityManager = req.scope.resolve("manager")

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const result = await manager.transaction(async (manager) => {
    await inventoryService
      .withTransaction(manager)
      .updateReservationItem(id, validatedBody)
  })

  res.status(200).json({ reservation: result })
}

/**
 * @schema AdminPostReservationsReservationReq
 * type: object
 * properties:
 *   location_id:
 *     description: "The id of the location of the reservation"
 *     type: string
 *   quantity:
 *     description: "The id of the reservation item"
 *     type: number
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 */
export class AdminPostReservationsReservationReq {
  @IsNumber()
  @IsOptional()
  quantity?: number

  @IsString()
  @IsOptional()
  location_id?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
