/**
 * @oas [post] /admin/reservations/{id}
 * operationId: PostReservationsId
 * summary: Update a Reservation
 * description: Update a reservation's details.
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - location_id
 *           - quantity
 *           - description
 *           - metadata
 *         properties:
 *           location_id:
 *             type: string
 *             title: location_id
 *             description: The reservation's location id.
 *           quantity:
 *             type: number
 *             title: quantity
 *             description: The reservation's quantity.
 *           description:
 *             type: string
 *             title: description
 *             description: The reservation's description.
 *           metadata:
 *             type: object
 *             description: The reservation's metadata.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/reservations/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "location_id": "{value}",
 *         "quantity": 1760360105246720,
 *         "description": "{value}",
 *         "metadata": {}
 *       }'
 * tags:
 *   - Reservations
 * responses:
 *   "200":
 *     description: OK
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
 * 
*/

