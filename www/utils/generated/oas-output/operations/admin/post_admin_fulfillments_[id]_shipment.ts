/**
 * @oas [post] /admin/fulfillments/{id}/shipment
 * operationId: PostFulfillmentsIdShipment
 * summary: Add Shipments to Fulfillment
 * description: Add a list of shipments to a fulfillment.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The fulfillment's ID.
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
 *           - labels
 *         properties:
 *           labels:
 *             type: array
 *             description: The fulfillment's labels.
 *             items:
 *               type: object
 *               description: The label's labels.
 *               required:
 *                 - tracking_number
 *                 - tracking_url
 *                 - label_url
 *               properties:
 *                 tracking_number:
 *                   type: string
 *                   title: tracking_number
 *                   description: The label's tracking number.
 *                 tracking_url:
 *                   type: string
 *                   title: tracking_url
 *                   description: The label's tracking url.
 *                 label_url:
 *                   type: string
 *                   title: label_url
 *                   description: The label's label url.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/fulfillments/{id}/shipment' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "labels": [
 *           {
 *             "tracking_number": "{value}",
 *             "tracking_url": "{value}",
 *             "label_url": "{value}"
 *           }
 *         ]
 *       }'
 * tags:
 *   - Fulfillments
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

