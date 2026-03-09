/**
 * @oas [get] /admin/gift-cards/{id}/orders
 * operationId: GetGiftCardsIdOrders
 * summary: List Gift Card's Orders
 * x-sidebar-summary: List Orders
 * description: Retrieve the list of orders that a gift card was used in.
 * x-authenticated: true
 * x-ignoreCleanup: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The gift card's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/gift-cards/{id}/orders' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Gift Cards
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
 * x-badges:
 *   - text: Cloud
 *     description: |
 *       This API route is only available in [Medusa Cloud](https://docs.medusajs.com/cloud/loyalty-plugin).
 * 
*/

