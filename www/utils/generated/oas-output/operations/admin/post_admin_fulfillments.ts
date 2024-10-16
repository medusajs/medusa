/**
 * @oas [post] /admin/fulfillments
 * operationId: PostFulfillments
 * summary: Create Fulfillment
 * description: Create a fulfillment for an order, return, exchange, and more.
 * x-authenticated: true
 * parameters:
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
 *         $ref: "#/components/schemas/AdminCreateFulfillment"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/fulfillments' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "location_id": "{value}",
 *         "provider_id": "{value}",
 *         "delivery_address": {
 *           "first_name": "{value}",
 *           "last_name": "{value}",
 *           "phone": "{value}",
 *           "company": "{value}",
 *           "address_1": "{value}",
 *           "address_2": "{value}",
 *           "city": "{value}",
 *           "country_code": "{value}",
 *           "province": "{value}",
 *           "postal_code": "{value}",
 *           "metadata": {}
 *         },
 *         "items": [
 *           {
 *             "title": "{value}",
 *             "sku": "{value}",
 *             "quantity": 1667318922870784,
 *             "barcode": "{value}",
 *             "line_item_id": "{value}",
 *             "inventory_item_id": "{value}"
 *           }
 *         ],
 *         "labels": [
 *           {
 *             "tracking_number": "{value}",
 *             "tracking_url": "{value}",
 *             "label_url": "{value}"
 *           }
 *         ],
 *         "order": {},
 *         "order_id": "{value}",
 *         "shipping_option_id": "{value}",
 *         "data": {},
 *         "packed_at": "2024-11-12T18:37:37.122Z",
 *         "shipped_at": "2025-04-13T12:39:42.432Z",
 *         "delivered_at": "2025-01-29T19:05:57.056Z",
 *         "canceled_at": "2025-02-16T02:12:11.763Z",
 *         "metadata": {}
 *       }'
 * tags:
 *   - Fulfillments
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminFulfillmentResponse"
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
 * x-workflow: createFulfillmentWorkflow
 * 
*/

