/**
 * @oas [delete] /admin/reservations/{id}
 * operationId: DeleteReservationsId
 * summary: Delete a Reservation
 * description: Delete a reservation.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The reservation's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.reservation.delete("res_123")
 *       .then(({ deleted }) => {
 *         console.log(deleted)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/reservations/{id}' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Reservations
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The deletion's details.
 *           required:
 *             - id
 *             - object
 *             - deleted
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The reservation's ID.
 *             object:
 *               type: string
 *               title: object
 *               description: The name of the deleted object.
 *               default: reservation
 *             deleted:
 *               type: boolean
 *               title: deleted
 *               description: Whether the reservation was deleted.
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
 * x-workflow: deleteReservationsWorkflow
 * x-events:
 *   - name: reservation-item.deleted
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the reservation
 *         order_id, // (optional) The ID of the order, if the reservation was deleted by an order flow
 *       }
 *       ```
 *     description: Emitted when reservations are deleted.
 *     deprecated: false
 *     since: 2.18.0
 * 
*/

