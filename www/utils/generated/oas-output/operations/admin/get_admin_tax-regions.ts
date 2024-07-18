/**
 * @oas [get] /admin/tax-regions
 * operationId: GetTaxRegions
 * summary: List Tax Regions
 * description: Retrieve a list of tax regions. The tax regions can be filtered by
 *   fields such as `id`. The tax regions can also be sorted or paginated.
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
 *     description: The tax region's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The tax region's q.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The tax region's ID.
 *         - type: array
 *           description: The tax region's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: country_code
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: country_code
 *           description: The tax region's country code.
 *         - type: array
 *           description: The tax region's country code.
 *           items:
 *             type: string
 *             title: country_code
 *             description: The country code's details.
 *         - type: object
 *           description: The tax region's country code.
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
 *   - name: province_code
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: province_code
 *           description: The tax region's province code.
 *         - type: array
 *           description: The tax region's province code.
 *           items:
 *             type: string
 *             title: province_code
 *             description: The province code's details.
 *         - type: object
 *           description: The tax region's province code.
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
 *   - name: parent_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: parent_id
 *           description: The tax region's parent id.
 *         - type: array
 *           description: The tax region's parent id.
 *           items:
 *             type: string
 *             title: parent_id
 *             description: The parent id's details.
 *         - type: object
 *           description: The tax region's parent id.
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
 *   - name: created_by
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: created_by
 *           description: The tax region's created by.
 *         - type: array
 *           description: The tax region's created by.
 *           items:
 *             type: string
 *             title: created_by
 *             description: The created by's details.
 *   - name: created_at
 *     in: query
 *     description: The tax region's created at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The tax region's created at.
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
 *     description: The tax region's updated at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The tax region's updated at.
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
 *     description: The tax region's deleted at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The tax region's deleted at.
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
 *       curl '{backend_url}/admin/tax-regions' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Tax Regions
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

