/**
 * @oas [get] /admin/shipping-options
 * operationId: GetShippingOptions
 * summary: List Shipping Options
 * description: Retrieve a list of shipping options. The shipping options can be
 *   filtered by fields such as `id`. The shipping options can also be sorted or
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
 *     description: >-
 *       Comma-separated fields that should be included in the returned data.
 *        * if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *        * without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: >-
 *         Comma-separated fields that should be included in the returned data.
 *          * if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *          * without prefix it will replace the entire default fields.
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
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The shipping option's ID.
 *         - type: array
 *           description: The shipping option's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: q
 *     in: query
 *     description: The shipping option's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The shipping option's q.
 *   - name: service_zone_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: service_zone_id
 *           description: The shipping option's service zone id.
 *         - type: array
 *           description: The shipping option's service zone id.
 *           items:
 *             type: string
 *             title: service_zone_id
 *             description: The service zone id's details.
 *   - name: shipping_profile_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: shipping_profile_id
 *           description: The shipping option's shipping profile id.
 *         - type: array
 *           description: The shipping option's shipping profile id.
 *           items:
 *             type: string
 *             title: shipping_profile_id
 *             description: The shipping profile id's details.
 *   - name: provider_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: provider_id
 *           description: The shipping option's provider id.
 *         - type: array
 *           description: The shipping option's provider id.
 *           items:
 *             type: string
 *             title: provider_id
 *             description: The provider id's details.
 *   - name: shipping_option_type_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: shipping_option_type_id
 *           description: The shipping option's shipping option type id.
 *         - type: array
 *           description: The shipping option's shipping option type id.
 *           items:
 *             type: string
 *             title: shipping_option_type_id
 *             description: The shipping option type id's details.
 *   - name: created_at
 *     in: query
 *     description: The shipping option's created at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The shipping option's created at.
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
 *     description: The shipping option's updated at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The shipping option's updated at.
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
 *     description: The shipping option's deleted at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The shipping option's deleted at.
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
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/shipping-options' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Shipping Options
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
 *                   description: The shipping option's limit.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The shipping option's offset.
 *                 count:
 *                   type: number
 *                   title: count
 *                   description: The shipping option's count.
 *             - type: object
 *               description: SUMMARY
 *               required:
 *                 - shipping_options
 *               properties:
 *                 shipping_options:
 *                   type: array
 *                   description: The shipping option's shipping options.
 *                   items:
 *                     $ref: "#/components/schemas/AdminShippingOption"
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

