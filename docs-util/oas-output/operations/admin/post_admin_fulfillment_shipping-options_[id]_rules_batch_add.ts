/**
 * @oas [post] /admin/fulfillment/shipping-options/{id}/rules/batch/add
 * operationId: PostFulfillmentShippingOptionsIdRulesBatchAdd
 * summary: Add Adds to Fulfillment
 * description: Add a list of adds to a fulfillment.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The fulfillment's ID.
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
 *         $ref: "#/components/schemas/AdminPostFulfillmentShippingOptionsRulesBatchAddReq"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: >-
 *       curl -X POST
 *       '{backend_url}/admin/fulfillment/shipping-options/{id}/rules/batch/add' \
 * 
 *       -H 'x-medusa-access-token: {api_token}' \
 * 
 *       -H 'Content-Type: application/json' \
 * 
 *       --data-raw '{
 *         "rules": [
 *           {
 *             "attribute": "{value}"
 *           }
 *         ]
 *       }'
 * tags:
 *   - Fulfillment
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

