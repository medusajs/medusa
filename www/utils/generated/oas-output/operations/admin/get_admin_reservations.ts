/**
 * @oas [get] /admin/reservations
 * operationId: GetReservations
 * summary: List Reservations
 * description: Retrieve a list of reservations. The reservations can be filtered
 *   by fields such as `id`. The reservations can also be sorted or paginated.
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - limit
 *           - fields
 *           - order
 *           - offset
 *           - location_id
 *           - inventory_item_id
 *           - line_item_id
 *           - created_by
 *           - description
 *           - quantity
 *           - created_at
 *           - updated_at
 *           - deleted_at
 *         properties:
 *           limit:
 *             type: number
 *             title: limit
 *             description: The reservation's limit.
 *           fields:
 *             type: string
 *             title: fields
 *             description: The reservation's fields.
 *           order:
 *             type: string
 *             title: order
 *             description: The reservation's order.
 *           offset:
 *             type: number
 *             title: offset
 *             description: The reservation's offset.
 *           location_id:
 *             oneOf:
 *               - type: string
 *                 title: location_id
 *                 description: The reservation's location id.
 *               - type: array
 *                 description: The reservation's location id.
 *                 items:
 *                   type: string
 *                   title: location_id
 *                   description: The location id's details.
 *           inventory_item_id:
 *             oneOf:
 *               - type: string
 *                 title: inventory_item_id
 *                 description: The reservation's inventory item id.
 *               - type: array
 *                 description: The reservation's inventory item id.
 *                 items:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The inventory item id's details.
 *           line_item_id:
 *             oneOf:
 *               - type: string
 *                 title: line_item_id
 *                 description: The reservation's line item id.
 *               - type: array
 *                 description: The reservation's line item id.
 *                 items:
 *                   type: string
 *                   title: line_item_id
 *                   description: The line item id's details.
 *           created_by:
 *             oneOf:
 *               - type: string
 *                 title: created_by
 *                 description: The reservation's created by.
 *               - type: array
 *                 description: The reservation's created by.
 *                 items:
 *                   type: string
 *                   title: created_by
 *                   description: The created by's details.
 *           description:
 *             oneOf:
 *               - type: string
 *                 title: description
 *                 description: The reservation's description.
 *               - type: object
 *                 description: The reservation's description.
 *                 required:
 *                   - $eq
 *                   - $ne
 *                   - $in
 *                   - $nin
 *                   - $like
 *                   - $ilike
 *                   - $re
 *                   - $contains
 *                   - $gt
 *                   - $gte
 *                   - $lt
 *                   - $lte
 *                 properties:
 *                   $eq: {}
 *                   $ne: {}
 *                   $in: {}
 *                   $nin: {}
 *                   $like: {}
 *                   $ilike: {}
 *                   $re: {}
 *                   $contains: {}
 *                   $gt: {}
 *                   $gte: {}
 *                   $lt: {}
 *                   $lte: {}
 *           quantity:
 *             type: object
 *             description: The reservation's quantity.
 *             required:
 *               - $eq
 *               - $ne
 *               - $in
 *               - $nin
 *               - $like
 *               - $ilike
 *               - $re
 *               - $contains
 *               - $gt
 *               - $gte
 *               - $lt
 *               - $lte
 *             properties:
 *               $eq: {}
 *               $ne: {}
 *               $in: {}
 *               $nin: {}
 *               $like: {}
 *               $ilike: {}
 *               $re: {}
 *               $contains: {}
 *               $gt: {}
 *               $gte: {}
 *               $lt: {}
 *               $lte: {}
 *           created_at:
 *             type: object
 *             description: The reservation's created at.
 *             required:
 *               - $eq
 *               - $ne
 *               - $in
 *               - $nin
 *               - $like
 *               - $ilike
 *               - $re
 *               - $contains
 *               - $gt
 *               - $gte
 *               - $lt
 *               - $lte
 *             properties:
 *               $eq: {}
 *               $ne: {}
 *               $in: {}
 *               $nin: {}
 *               $like: {}
 *               $ilike: {}
 *               $re: {}
 *               $contains: {}
 *               $gt: {}
 *               $gte: {}
 *               $lt: {}
 *               $lte: {}
 *           updated_at:
 *             type: object
 *             description: The reservation's updated at.
 *             required:
 *               - $eq
 *               - $ne
 *               - $in
 *               - $nin
 *               - $like
 *               - $ilike
 *               - $re
 *               - $contains
 *               - $gt
 *               - $gte
 *               - $lt
 *               - $lte
 *             properties:
 *               $eq: {}
 *               $ne: {}
 *               $in: {}
 *               $nin: {}
 *               $like: {}
 *               $ilike: {}
 *               $re: {}
 *               $contains: {}
 *               $gt: {}
 *               $gte: {}
 *               $lt: {}
 *               $lte: {}
 *           deleted_at:
 *             type: object
 *             description: The reservation's deleted at.
 *             required:
 *               - $eq
 *               - $ne
 *               - $in
 *               - $nin
 *               - $like
 *               - $ilike
 *               - $re
 *               - $contains
 *               - $gt
 *               - $gte
 *               - $lt
 *               - $lte
 *             properties:
 *               $eq: {}
 *               $ne: {}
 *               $in: {}
 *               $nin: {}
 *               $like: {}
 *               $ilike: {}
 *               $re: {}
 *               $contains: {}
 *               $gt: {}
 *               $gte: {}
 *               $lt: {}
 *               $lte: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/reservations' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "limit": 7964169955442688,
 *         "fields": "{value}",
 *         "order": "{value}",
 *         "offset": 3052067430072320,
 *         "quantity": {},
 *         "created_at": {},
 *         "updated_at": {},
 *         "deleted_at": {}
 *       }'
 * tags:
 *   - Reservations
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
 * 
*/

