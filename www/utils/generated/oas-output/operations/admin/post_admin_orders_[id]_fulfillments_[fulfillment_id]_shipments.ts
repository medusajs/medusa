/**
 * @oas [post] /admin/orders/{id}/fulfillments/{fulfillment_id}/shipments
 * operationId: PostOrdersIdFulfillmentsFulfillment_idShipments
 * summary: Create Shipment for an Order's Fulfillment
 * x-sidebar-summary: Create Shipment
 * description: Create a shipment for an order's fulfillment.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The order's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fulfillment_id
 *     in: path
 *     description: The fulfillment's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         allOf:
 *           - type: object
 *             description: The shipment's details.
 *             required:
 *               - items
 *               - metadata
 *             properties:
 *               items:
 *                 type: array
 *                 description: The items to create shipment for.
 *                 items:
 *                   type: object
 *                   description: The details of the item to create shipment for.
 *                   required:
 *                     - id
 *                     - quantity
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The item's ID.
 *                     quantity:
 *                       type: number
 *                       title: quantity
 *                       description: The item's quantity to ship.
 *               labels:
 *                 type: array
 *                 description: The labels to create for the shipment.
 *                 items:
 *                   type: object
 *                   description: The label's labels.
 *                   required:
 *                     - tracking_number
 *                     - tracking_url
 *                     - label_url
 *                   properties:
 *                     tracking_number:
 *                       type: string
 *                       title: tracking_number
 *                       description: The label's tracking number.
 *                     tracking_url:
 *                       type: string
 *                       title: tracking_url
 *                       description: The label's tracking url.
 *                     label_url:
 *                       type: string
 *                       title: label_url
 *                       description: The label's url.
 *               no_notification:
 *                 type: boolean
 *                 title: no_notification
 *                 description: Whether to send the customer a notification about the created shipment.
 *               metadata:
 *                 type: object
 *                 description: The shipment's metadata. Can hold custom key-value pairs.
 *           - type: object
 *             description: The shipment's details.
 *             properties:
 *               additional_data:
 *                 type: object
 *                 description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
 *         description: The shipment's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/orders/{id}/fulfillments/{fulfillment_id}/shipments' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "items": [
 *           {
 *             "id": "id_3QQtl2VvE73c",
 *             "quantity": 6772917941567488
 *           }
 *         ],
 *         "metadata": {}
 *       }'
 * tags:
 *   - Orders
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrderResponse"
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
 * x-workflow: createOrderShipmentWorkflow
 * 
*/

