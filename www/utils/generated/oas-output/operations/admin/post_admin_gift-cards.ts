/**
 * @oas [post] /admin/gift-cards
 * operationId: PostGiftCards
 * summary: Create Gift Card
 * description: Create a gift card.
 * x-authenticated: true
 * x-ignoreCleanup: true
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminCreateGiftCardParams"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/gift-cards' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "code": "{value}",
 *         "value": 19,
 *         "currency_code": "bwp",
 *         "expires_at": "2025-07-20T15:47:23.951Z",
 *         "reference_id": "{value}",
 *         "reference": "{value}",
 *         "line_item_id": "{value}",
 *         "customer_id": "{value}",
 *         "metadata": {}
 *       }'
 * tags:
 *   - Gift Cards
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminGiftCardResponse"
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

