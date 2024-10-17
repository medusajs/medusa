/**
 * @oas [delete] /store/carts/{id}/line-items/{line_id}
 * operationId: DeleteCartsIdLineItemsLine_id
 * summary: Remove Line Item from Cart
 * x-sidebar-summary: Remove Line Item
 * description: Remove a line item from a cart.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/storefront-development/cart/manage-items#remove-line-item-from-cart
 *   description: "Storefront guide: How to remove line item from cart."
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The cart's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: line_id
 *     in: path
 *     description: The line item's ID.
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
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/store/carts/{id}/line-items/{line_id}' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 * tags:
 *   - Carts
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
 *                   description: The ID of the deleted line item.
 *                 object:
 *                   type: string
 *                   title: object
 *                   description: The name of the deleted object.
 *                   default: line-item
 *                 deleted:
 *                   type: boolean
 *                   title: deleted
 *                   description: Whether the item was deleted.
 *             - type: object
 *               description: The deletion's details.
 *               properties:
 *                 parent:
 *                   $ref: "#/components/schemas/StoreCart"
 *                   description: The cart that the item belonged to.
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
 * x-workflow: deleteLineItemsWorkflow
 * 
*/

