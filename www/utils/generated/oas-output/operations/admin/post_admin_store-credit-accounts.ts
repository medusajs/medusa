/**
 * @oas [post] /admin/store-credit-accounts
 * operationId: PostStoreCreditAccounts
 * summary: Create Store Credit Account
 * description: Create a store credit account.
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
 *         $ref: "#/components/schemas/AdminCreateStoreCreditAccount"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/store-credit-accounts' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "currency_code": "nzd",
 *         "customer_id": "{value}"
 *       }'
 * tags:
 *   - Store Credit Accounts
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminStoreCreditAccountResponse"
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

