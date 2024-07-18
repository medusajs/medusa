/**
 * @oas [get] /admin/tax-rates
 * operationId: GetTaxRates
 * summary: List Tax Rates
 * description: Retrieve a list of tax rates. The tax rates can be filtered by
 *   fields such as `id`. The tax rates can also be sorted or paginated.
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
 *     description: The tax rate's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The tax rate's q.
 *   - name: tax_region_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: tax_region_id
 *           description: The tax rate's tax region id.
 *         - type: array
 *           description: The tax rate's tax region id.
 *           items:
 *             type: string
 *             title: tax_region_id
 *             description: The tax region id's details.
 *         - type: object
 *           description: The tax rate's tax region id.
 *           required:
 *             - $eq
 *             - $ne
 *             - $in
 *             - $nin
 *             - $like
 *             - $ilike
 *             - $re
 *             - $contains
 *             - $gt
 *             - $gte
 *             - $lt
 *             - $lte
 *           properties:
 *             $eq: {}
 *             $ne: {}
 *             $in: {}
 *             $nin: {}
 *             $like: {}
 *             $ilike: {}
 *             $re: {}
 *             $contains: {}
 *             $gt: {}
 *             $gte: {}
 *             $lt: {}
 *             $lte: {}
 *   - name: is_default
 *     in: query
 *     required: false
 *     schema:
 *       type: string
 *       enum:
 *         - "true"
 *         - "false"
 *   - name: created_at
 *     in: query
 *     description: The tax rate's created at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The tax rate's created at.
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
 *     description: The tax rate's updated at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The tax rate's updated at.
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
 *     description: The tax rate's deleted at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The tax rate's deleted at.
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
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/tax-rates' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Tax Rates
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

