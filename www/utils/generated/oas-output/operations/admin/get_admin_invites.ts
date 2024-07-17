/**
 * @oas [get] /admin/invites
 * operationId: GetInvites
 * summary: List Invites
 * description: Retrieve a list of invites. The invites can be filtered by fields
 *   such as `id`. The invites can also be sorted or paginated.
 * x-authenticated: false
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
 *     description: The invite's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The invite's q.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The invite's ID.
 *         - type: array
 *           description: The invite's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: email
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: email
 *           description: The invite's email.
 *           format: email
 *         - type: array
 *           description: The invite's email.
 *           items:
 *             type: string
 *             title: email
 *             description: The email's details.
 *             format: email
 *   - name: created_at
 *     in: query
 *     description: The invite's created at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The invite's created at.
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
 *   - name: updated_at
 *     in: query
 *     description: The invite's updated at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The invite's updated at.
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
 *   - name: deleted_at
 *     in: query
 *     description: The invite's deleted at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The invite's deleted at.
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
 *   - name: $and
 *     in: query
 *     required: false
 *     schema: {}
 *   - name: $or
 *     in: query
 *     required: false
 *     schema: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/admin/invites'
 * tags:
 *   - Invites
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

