/**
 * @oas [post] /admin/inventory-items/{id}/location-levels/batch
 * operationId: PostInventoryItemsIdLocationLevelsBatch
 * summary: Add Location Levels to Inventory Item
 * description: Add a list of location levels to a inventory item.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The inventory item's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: expand
 *     in: query
 *     description: Comma-separated relations that should be expanded in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: expand
 *       description: Comma-separated relations that should be expanded in the returned data.
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data.
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *   - name: order
 *     in: query
 *     description: Field to sort items in the list by.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: Field to sort items in the list by.
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: >-
 *       curl -X POST
 *       '{backend_url}/admin/inventory-items/{id}/location-levels/batch' \
 * 
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Inventory Items
 * responses:
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         properties:
 *           create:
 *             type: array
 *             description: The inventory item's create.
 *             items:
 *               type: object
 *               description: The create's details.
 *               required:
 *                 - location_id
 *                 - stocked_quantity
 *                 - incoming_quantity
 *               properties:
 *                 location_id:
 *                   type: string
 *                   title: location_id
 *                   description: The create's location id.
 *                 stocked_quantity:
 *                   type: number
 *                   title: stocked_quantity
 *                   description: The create's stocked quantity.
 *                 incoming_quantity:
 *                   type: number
 *                   title: incoming_quantity
 *                   description: The create's incoming quantity.
 *           update:
 *             type: array
 *             description: The inventory item's update.
 *             items:
 *               type: object
 *               description: The update's details.
 *               required:
 *                 - stocked_quantity
 *                 - incoming_quantity
 *               properties:
 *                 stocked_quantity:
 *                   type: number
 *                   title: stocked_quantity
 *                   description: The update's stocked quantity.
 *                 incoming_quantity:
 *                   type: number
 *                   title: incoming_quantity
 *                   description: The update's incoming quantity.
 *           delete:
 *             type: array
 *             description: The inventory item's delete.
 *             items:
 *               type: string
 *               title: delete
 *               description: The delete's details.
 * 
*/

