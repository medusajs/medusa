/**
 * @oas [post] /store/store-credit-accounts/claim
 * operationId: PostStoreCreditAccountsClaim
 * summary: Claim a Store Credit Account
 * description: Claim a store credit account as the logged-in customer. The store credit account must not belong to another customer, and it must have amount available to claim. This is typically used to
 *   claim anonymous store credit accounts, such as those created for guest users or through gift cards.
 * x-sidebar-summary: Claim Store Credit Account
 * x-authenticated: true
 * parameters:
 *   - name: x-publishable-api-key
 *     in: header
 *     description: Publishable API Key created in the Medusa Admin.
 *     required: true
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://docs.medusajs.com/api/store#publishable-api-key
 *   - name: x-medusa-locale
 *     in: header
 *     description: The locale in BCP 47 format to retrieve localized content.
 *     required: false
 *     schema:
 *       type: string
 *       example: en-US
 *       externalDocs:
 *         url: https://docs.medusajs.com/resources/commerce-modules/translation/storefront
 *         description: Learn more in the Serve Translations in Storefront guide.
 *   - name: locale
 *     in: query
 *     description: The locale in BCP 47 format to retrieve localized content.
 *     required: false
 *     schema:
 *       type: string
 *       example: en-US
 *       externalDocs:
 *         url: https://docs.medusajs.com/resources/commerce-modules/translation/storefront
 *         description: Learn more in the Serve Translations in Storefront guide.
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StoreClaimStoreCreditAccountParams"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/store-credit-accounts/claim' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "code": "{value}"
 *       }'
 * tags:
 *   - Store Credit Accounts
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreClaimStoreCreditAccountResponse"
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
 *   - text: Loyalty Plugin
 *     description: |
 *       This API route is only available through the [Loyalty Plugin](https://docs.medusajs.com/resources/commerce-modules/store-credit).
 * 
*/

