/**
 * @oas [delete] /admin/exchanges/{id}/request
 * operationId: DeleteExchangesIdRequest
 * summary: Cancel Exchange Request
 * description: Cancel a requested exchange.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The exchange's ID.
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
 *       curl -X DELETE '{backend_url}/admin/exchanges/{id}/request' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Exchanges
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: SUMMARY
 *           required:
 *             - id
 *             - object
 *             - deleted
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The exchange's ID.
 *             object:
 *               type: string
 *               title: object
 *               description: The name of the deleted object.
 *               default: exchange
 *             deleted:
 *               type: boolean
 *               title: deleted
 *               description: Whether the exchange was deleted.
 *             parent:
 *               type: object
 *               description: The exchange's parent.
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
 * x-workflow: cancelBeginOrderExchangeWorkflow
 * 
*/

