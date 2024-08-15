/**
 * @oas [get] /admin/return-reasons
 * operationId: GetReturnReasons
 * summary: List Return Reasons
 * description: Retrieve a list of return reasons. The return reasons can be
 *   filtered by fields such as `id`. The return reasons can also be sorted or
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
 *     description: The return reason's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The return reason's q.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The return reason's ID.
 *         - type: array
 *           description: The return reason's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: value
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: value
 *           description: The return reason's value.
 *         - type: array
 *           description: The return reason's value.
 *           items:
 *             type: string
 *             title: value
 *             description: The value's details.
 *   - name: label
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: label
 *           description: The return reason's label.
 *         - type: array
 *           description: The return reason's label.
 *           items:
 *             type: string
 *             title: label
 *             description: The label's details.
 *   - name: description
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: description
 *           description: The return reason's description.
 *         - type: array
 *           description: The return reason's description.
 *           items:
 *             type: string
 *             title: description
 *             description: The description's details.
 *   - name: parent_return_reason_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: parent_return_reason_id
 *           description: The return reason's parent return reason id.
 *         - type: array
 *           description: The return reason's parent return reason id.
 *           items:
 *             type: string
 *             title: parent_return_reason_id
 *             description: The parent return reason id's details.
 *   - name: created_at
 *     in: query
 *     description: The return reason's created at.
 *     required: false
 *     schema:
 *       type: string
 *       format: date-time
 *       title: created_at
 *       description: The return reason's created at.
 *   - name: updated_at
 *     in: query
 *     description: The return reason's updated at.
 *     required: false
 *     schema:
 *       type: string
 *       format: date-time
 *       title: updated_at
 *       description: The return reason's updated at.
 *   - name: deleted_at
 *     in: query
 *     description: The return reason's deleted at.
 *     required: false
 *     schema:
 *       type: string
 *       format: date-time
 *       title: deleted_at
 *       description: The return reason's deleted at.
 *   - name: $and
 *     in: query
 *     description: The return reason's $and.
 *     required: false
 *     schema:
 *       type: array
 *       description: The return reason's $and.
 *       items:
 *         type: object
 *       title: $and
 *   - name: $or
 *     in: query
 *     description: The return reason's $or.
 *     required: false
 *     schema:
 *       type: array
 *       description: The return reason's $or.
 *       items:
 *         type: object
 *       title: $or
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/return-reasons' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Return Reasons
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminReturnReasonListResponse"
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

