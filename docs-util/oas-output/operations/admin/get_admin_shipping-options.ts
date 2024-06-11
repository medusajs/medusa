/**
 * @oas [get] /admin/shipping-options
 * operationId: GetShippingOptions
 * summary: List Shipping Options
 * description: Retrieve a list of shipping options. The shipping options can be
 *   filtered by fields such as `id`. The shipping options can also be sorted or
 *   paginated.
 * x-authenticated: true
 * parameters: []
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
 *           - fields
 *           - offset
 *           - limit
 *           - order
 *         properties:
 *           fields:
 *             type: string
 *             title: fields
 *             description: The shipping option's fields.
 *           offset:
 *             type: number
 *             title: offset
 *             description: The shipping option's offset.
 *           limit:
 *             type: number
 *             title: limit
 *             description: The shipping option's limit.
 *           order:
 *             type: string
 *             title: order
 *             description: The shipping option's order.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/shipping-options' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "fields": "{value}",
 *         "offset": 2897312200261632,
 *         "limit": 5564481717403648,
 *         "order": "{value}"
 *       }'
 * tags:
 *   - Shipping Options
 * responses:
 *   "200":
 *     description: OK
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

