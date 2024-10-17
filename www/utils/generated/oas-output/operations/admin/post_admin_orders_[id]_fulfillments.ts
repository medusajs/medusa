/**
 * @oas [post] /admin/orders/{id}/fulfillments
 * operationId: PostOrdersIdFulfillments
 * summary: Create an Order Fulfillment
 * x-sidebar-summary: Create Fulfillment
 * description: Create a fulfillment for an order. The creation fails if the order is canceled.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The order's ID.
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
 *             description: The fulfillment's details.
 *             required:
 *               - items
 *               - location_id
 *               - metadata
 *             properties:
 *               items:
 *                 type: array
 *                 description: The items to fulfill.
 *                 items:
 *                   type: object
 *                   description: An item's details.
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
 *                       description: The item's quantity to fulfill.
 *               location_id:
 *                 type: string
 *                 title: location_id
 *                 description: The ID of the location to fulfill the items from. If not provided, the location associated with the shipping option of the order's shipping method is used.
 *               no_notification:
 *                 type: boolean
 *                 title: no_notification
 *                 description: Whether to send the customer a notification about the created fulfillment.
 *               metadata:
 *                 type: object
 *                 description: The order's metadata. Can hold custom key-value pairs.
 *           - type: object
 *             description: The fulfillment's details.
 *             properties:
 *               additional_data:
 *                 type: object
 *                 description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
 *         description: The fulfillment's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/orders/{id}/fulfillments' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "items": [
 *           {
 *             "id": "id_YePfQ6PBCBKvmYyreUt2",
 *             "quantity": 6623610359775232
 *           }
 *         ],
 *         "location_id": "{value}",
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
 * x-workflow: createOrderFulfillmentWorkflow
 * 
*/

