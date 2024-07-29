/**
 * @oas [get] /admin/sales-channels
 * operationId: GetSalesChannels
 * summary: List Sales Channels
 * description: Retrieve a list of sales channels. The sales channels can be
 *   filtered by fields such as `id`. The sales channels can also be sorted or
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
 *     description: The sales channel's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The sales channel's q.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The sales channel's ID.
 *         - type: array
 *           description: The sales channel's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: name
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: name
 *           description: The sales channel's name.
 *         - type: array
 *           description: The sales channel's name.
 *           items:
 *             type: string
 *             title: name
 *             description: The name's details.
 *   - name: description
 *     in: query
 *     description: The sales channel's description.
 *     required: false
 *     schema:
 *       type: string
 *       title: description
 *       description: The sales channel's description.
 *   - name: is_disabled
 *     in: query
 *     description: The sales channel's is disabled.
 *     required: true
 *     schema:
 *       type: boolean
 *       title: is_disabled
 *       description: The sales channel's is disabled.
 *   - name: created_at
 *     in: query
 *     description: The sales channel's created at.
 *     required: false
 *     schema:
 *       type: string
 *       description: The sales channel's created at.
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
 *       title: created_at
 *   - name: updated_at
 *     in: query
 *     description: The sales channel's updated at.
 *     required: false
 *     schema:
 *       type: string
 *       description: The sales channel's updated at.
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
 *       title: updated_at
 *   - name: deleted_at
 *     in: query
 *     description: The sales channel's deleted at.
 *     required: false
 *     schema:
 *       type: string
 *       description: The sales channel's deleted at.
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
 *       title: deleted_at
 *   - name: location_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: location_id
 *           description: The sales channel's location id.
 *         - type: array
 *           description: The sales channel's location id.
 *           items:
 *             type: string
 *             title: location_id
 *             description: The location id's details.
 *   - name: publishable_key_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: publishable_key_id
 *           description: The sales channel's publishable key id.
 *         - type: array
 *           description: The sales channel's publishable key id.
 *           items:
 *             type: string
 *             title: publishable_key_id
 *             description: The publishable key id's details.
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
 *       curl '{backend_url}/admin/sales-channels' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Sales Channels
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

