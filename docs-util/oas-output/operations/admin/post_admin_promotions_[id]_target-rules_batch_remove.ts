/**
 * @oas [post] /admin/promotions/{id}/target-rules/batch/remove
 * operationId: PostPromotionsIdTargetRulesBatchRemove
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
 *       curl -X POST
 *       '{backend_url}/admin/promotions/{id}/target-rules/batch/remove' \
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

