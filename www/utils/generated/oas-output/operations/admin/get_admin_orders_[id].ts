/**
 * @oas [get] /admin/orders/{id}
 * operationId: GetOrdersId
 * summary: Get an Order
 * description: Retrieve an order by its ID. You can expand the order's relations or select the fields that should be returned.
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
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The order's ID.
 *         - type: array
 *           description: The order's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: status
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: status
 *           description: The order's status.
 *         - type: array
 *           description: The order's status.
 *           items:
 *             type: string
 *             title: status
 *             description: The status's details.
 *   - name: version
 *     in: query
 *     description: The order's version.
 *     required: false
 *     schema:
 *       type: number
 *       title: version
 *       description: The order's version.
 *   - name: created_at
 *     in: query
 *     required: false
 *     schema: {}
 *   - name: updated_at
 *     in: query
 *     required: false
 *     schema: {}
 *   - name: deleted_at
 *     in: query
 *     required: false
 *     schema: {}
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/orders/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
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
 * x-workflow: getOrderDetailWorkflow
 * 
*/

