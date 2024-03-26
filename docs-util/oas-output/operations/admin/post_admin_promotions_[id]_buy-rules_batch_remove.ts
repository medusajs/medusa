/**
 * @oas [post] /admin/promotions/{id}/buy-rules/batch/remove
 * operationId: PostPromotionsIdBuyRulesBatchRemove
 * summary: Add Removes to Promotion
 * description: Add a list of removes to a promotion.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The promotion's ID.
 *     required: true
 *     schema:
 *       type: string
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
 *     description: Comma-separated fields that should be included in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data.
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
 *     description: Field to sort items in the list by.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: Field to sort items in the list by.
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostPromotionsPromotionRulesBatchRemoveReq"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: >-
 *       curl -X POST '{backend_url}/admin/promotions/{id}/buy-rules/batch/remove'
 *       \
 * 
 *       -H 'x-medusa-access-token: {api_token}' \
 * 
 *       -H 'Content-Type: application/json' \
 * 
 *       --data-raw '{
 *         "rule_ids": [
 *           "{value}"
 *         ]
 *       }'
 * tags:
 *   - Promotions
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

