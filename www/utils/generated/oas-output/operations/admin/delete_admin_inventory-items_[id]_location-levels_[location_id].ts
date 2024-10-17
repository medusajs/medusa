/**
 * @oas [delete] /admin/inventory-items/{id}/location-levels/{location_id}
 * operationId: DeleteInventoryItemsIdLocationLevelsLocation_id
 * summary: Remove Inventory Level of Inventory Item
 * x-sidebar-summary: Remove Inventory Level
 * description: |
 *   Remove the inventory level of an inventory item.
 * 
 *   If the inventory level has reserved quantity greater than `0`, an error is thrown.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The inventory item's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: location_id
 *     in: path
 *     description: The inventory item's location id.
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
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: "curl -X DELETE '{backend_url}/admin/inventory-items/{id}/location-levels/{location_id}' \\ -H 'Authorization: Bearer {access_token}'"
 * tags:
 *   - Inventory Items
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           allOf:
 *             - type: object
 *               description: The deletion's details.
 *               required:
 *                 - id
 *                 - object
 *                 - deleted
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The inventory item's ID.
 *                 object:
 *                   type: string
 *                   title: object
 *                   description: The name of the deleted object.
 *                 deleted:
 *                   type: boolean
 *                   title: deleted
 *                   description: Whether the Inventory Item was deleted.
 *             - type: object
 *               description: The deletion's details.
 *               properties:
 *                 parent:
 *                   $ref: "#/components/schemas/AdminInventoryItem"
 *           description: The deletion's details.
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
 * x-workflow: deleteInventoryLevelsWorkflow
 * 
*/

