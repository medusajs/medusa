/**
 * @oas [get] /store/orders
 * operationId: GetOrders
 * summary: List Logged-in Customer's Orders
 * x-sidebar-summary: List Orders
 * description: Retrieve the orders of the logged-in customer. The orders can be filtered by fields such as `id`. The orders can also be sorted or paginated.
 * x-authenticated: true
 * parameters:
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
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
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
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: Filter by an order ID.
 *         - type: array
 *           description: Filter by order IDs.
 *           items:
 *             type: string
 *             title: id
 *             description: An order ID.
 *   - name: $and
 *     in: query
 *     required: false
 *     schema:
 *       type: array
 *       description: The order's $and.
 *       items:
 *         type: object
 *       title: $and
 *   - name: $or
 *     in: query
 *     required: false
 *     schema:
 *       type: array
 *       description: The order's $or.
 *       items:
 *         type: object
 *       title: $or
 *   - name: status
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: status
 *           description: The order's status.
 *         - type: string
 *           title: status
 *           description: The order's status.
 *         - type: string
 *           title: status
 *           description: The order's status.
 *         - type: string
 *           title: status
 *           description: The order's status.
 *         - type: string
 *           title: status
 *           description: The order's status.
 *         - type: string
 *           title: status
 *           description: The order's status.
 *         - type: array
 *           description: The order's status.
 *           items:
 *             type: string
 *             description: The status's details.
 *             enum:
 *               - canceled
 *               - requires_action
 *               - pending
 *               - completed
 *               - draft
 *               - archived
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/store/orders' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 * tags:
 *   - Orders
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           allOf:
 *             - type: object
 *               description: SUMMARY
 *               required:
 *                 - limit
 *                 - offset
 *                 - count
 *               properties:
 *                 limit:
 *                   type: number
 *                   title: limit
 *                   description: The order's limit.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The order's offset.
 *                 count:
 *                   type: number
 *                   title: count
 *                   description: The order's count.
 *             - type: object
 *               description: SUMMARY
 *               required:
 *                 - orders
 *               properties:
 *                 orders:
 *                   type: array
 *                   description: The order's orders.
 *                   items:
 *                     $ref: "#/components/schemas/StoreOrder"
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
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * 
*/

