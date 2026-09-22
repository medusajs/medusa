/**
 * @oas [post] /admin/store-credit-accounts/{id}/debit
 * operationId: PostStoreCreditAccountsIdDebit
 * summary: Debit a Store Credit Account
 * description: Debit an amount from a store credit account, deducting it from the customer's store credit balance. The debit is recorded as a `debit` transaction on the account that references the authenticated admin user.
 * externalDocs:
 *   description: Learn about store credit accounts and transactions
 *   url: https://docs.medusajs.com/resources/commerce-modules/store-credit/concepts
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The store credit account's ID.
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
 *         $ref: "#/components/schemas/AdminDebitStoreCreditAccountParams"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/store-credit-accounts/{id}/debit' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "amount": 24
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
 * 
*/

