/**
 * @oas [post] /admin/price-lists/{id}
 * operationId: PostPriceListsId
 * summary: Update a Price List
 * description: Update a price list's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The price list's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostPriceListsPriceListReq"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/price-lists/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "prices": [
 *           {
 *             "currency_code": "{value}",
 *             "amount": 1670236243755008,
 *             "variant_id": "{value}"
 *           }
 *         ]
 *       }'
 * tags:
 *   - Price Lists
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

