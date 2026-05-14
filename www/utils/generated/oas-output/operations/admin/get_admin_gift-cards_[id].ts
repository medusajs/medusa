/**
 * @oas [get] /admin/gift-cards/{id}
 * operationId: GetGiftCardsId
 * summary: Get a Gift Card
 * description: Retrieve a gift card by its ID. You can expand the gift card's relations or select the fields that should be returned.
 * x-authenticated: true
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
 *       curl '{backend_url}/admin/gift-cards/{id}' \
 *       -H 'Authorization: Bearer {jwt_token}'
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
 *   - text: Loyalty Plugin
 *     description: |
 *       This API route is only available through the [Loyalty Plugin](https://docs.medusajs.com/resources/commerce-modules/loyalty).
 * 
*/

