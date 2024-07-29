/**
 * @oas [get] /admin/inventory-items
 * operationId: GetInventoryItems
 * summary: List Inventory Items
 * description: Retrieve a list of inventory items. The inventory items can be
 *   filtered by fields such as `id`. The inventory items can also be sorted or
 *   paginated.
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
 *     description: Comma-separated fields that should be included in the returned
 *       data. if a field is prefixed with `+` it will be added to the default
 *       fields, using `-` will remove it from the default fields. without prefix
 *       it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned
 *         data. if a field is prefixed with `+` it will be added to the default
 *         fields, using `-` will remove it from the default fields. without prefix
 *         it will replace the entire default fields.
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
 *     description: The field to sort the data by. By default, the sort order is
 *       ascending. To change the order to descending, prefix the field name with
 *       `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is
 *         ascending. To change the order to descending, prefix the field name with
 *         `-`.
 *   - name: q
 *     in: query
 *     description: The inventory item's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The inventory item's q.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The inventory item's ID.
 *         - type: array
 *           description: The inventory item's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: sku
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: sku
 *           description: The inventory item's sku.
 *         - type: array
 *           description: The inventory item's sku.
 *           items:
 *             type: string
 *             title: sku
 *             description: The sku's details.
 *   - name: origin_country
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: origin_country
 *           description: The inventory item's origin country.
 *         - type: array
 *           description: The inventory item's origin country.
 *           items:
 *             type: string
 *             title: origin_country
 *             description: The origin country's details.
 *   - name: mid_code
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: mid_code
 *           description: The inventory item's mid code.
 *         - type: array
 *           description: The inventory item's mid code.
 *           items:
 *             type: string
 *             title: mid_code
 *             description: The mid code's details.
 *   - name: hs_code
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: hs_code
 *           description: The inventory item's hs code.
 *         - type: array
 *           description: The inventory item's hs code.
 *           items:
 *             type: string
 *             title: hs_code
 *             description: The hs code's details.
 *   - name: material
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: material
 *           description: The inventory item's material.
 *         - type: array
 *           description: The inventory item's material.
 *           items:
 *             type: string
 *             title: material
 *             description: The material's details.
 *   - name: requires_shipping
 *     in: query
 *     description: The inventory item's requires shipping.
 *     required: true
 *     schema:
 *       type: boolean
 *       title: requires_shipping
 *       description: The inventory item's requires shipping.
 *   - name: weight
 *     in: query
 *     description: The inventory item's weight.
 *     required: false
 *     schema:
 *       description: The inventory item's weight.
 *       required:
 *         - $eq
 *         - $ne
 *         - $in
 *         - $nin
 *         - $like
 *         - $ilike
 *         - $re
 *         - $contains
 *         - $gt
 *         - $gte
 *         - $lt
 *         - $lte
 *       properties:
 *         $eq: {}
 *         $ne: {}
 *         $in: {}
 *         $nin: {}
 *         $like: {}
 *         $ilike: {}
 *         $re: {}
 *         $contains: {}
 *         $gt: {}
 *         $gte: {}
 *         $lt: {}
 *         $lte: {}
 *   - name: length
 *     in: query
 *     description: The inventory item's length.
 *     required: false
 *     schema:
 *       description: The inventory item's length.
 *       required:
 *         - $eq
 *         - $ne
 *         - $in
 *         - $nin
 *         - $like
 *         - $ilike
 *         - $re
 *         - $contains
 *         - $gt
 *         - $gte
 *         - $lt
 *         - $lte
 *       properties:
 *         $eq: {}
 *         $ne: {}
 *         $in: {}
 *         $nin: {}
 *         $like: {}
 *         $ilike: {}
 *         $re: {}
 *         $contains: {}
 *         $gt: {}
 *         $gte: {}
 *         $lt: {}
 *         $lte: {}
 *   - name: height
 *     in: query
 *     description: The inventory item's height.
 *     required: false
 *     schema:
 *       description: The inventory item's height.
 *       required:
 *         - $eq
 *         - $ne
 *         - $in
 *         - $nin
 *         - $like
 *         - $ilike
 *         - $re
 *         - $contains
 *         - $gt
 *         - $gte
 *         - $lt
 *         - $lte
 *       properties:
 *         $eq: {}
 *         $ne: {}
 *         $in: {}
 *         $nin: {}
 *         $like: {}
 *         $ilike: {}
 *         $re: {}
 *         $contains: {}
 *         $gt: {}
 *         $gte: {}
 *         $lt: {}
 *         $lte: {}
 *   - name: width
 *     in: query
 *     description: The inventory item's width.
 *     required: false
 *     schema:
 *       description: The inventory item's width.
 *       required:
 *         - $eq
 *         - $ne
 *         - $in
 *         - $nin
 *         - $like
 *         - $ilike
 *         - $re
 *         - $contains
 *         - $gt
 *         - $gte
 *         - $lt
 *         - $lte
 *       properties:
 *         $eq: {}
 *         $ne: {}
 *         $in: {}
 *         $nin: {}
 *         $like: {}
 *         $ilike: {}
 *         $re: {}
 *         $contains: {}
 *         $gt: {}
 *         $gte: {}
 *         $lt: {}
 *         $lte: {}
 *   - name: location_levels
 *     in: query
 *     description: The inventory item's location levels.
 *     required: false
 *     schema:
 *       type: object
 *       description: The inventory item's location levels.
 *       properties:
 *         location_id:
 *           oneOf:
 *             - type: string
 *               title: location_id
 *               description: The location level's location id.
 *             - type: array
 *               description: The location level's location id.
 *               items:
 *                 type: string
 *                 title: location_id
 *                 description: The location id's details.
 *   - name: $and
 *     in: query
 *     required: false
 *     schema: {}
 *   - name: $or
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
 *       curl '{backend_url}/admin/inventory-items' \
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
 * 
*/

