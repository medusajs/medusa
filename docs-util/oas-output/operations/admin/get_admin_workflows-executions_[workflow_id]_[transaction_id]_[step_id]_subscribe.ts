/**
 * @oas [get] /admin/workflows-executions/{workflow_id}/{transaction_id}/{step_id}/subscribe
 * operationId: GetWorkflowsExecutionsWorkflow_idTransaction_idStep_idSubscribe
 * summary: List Subscribes
 * description: Retrieve a list of subscribes in a workflows execution. The
 *   subscribes can be filtered by fields like FILTER FIELDS. The subscribes can
 *   also be paginated.
 * x-authenticated: true
 * parameters:
 *   - name: workflow_id
 *     in: path
 *     description: The workflows execution's workflow id.
 *     required: true
 *     schema:
 *       type: string
 *   - name: transaction_id
 *     in: path
 *     description: The workflows execution's transaction id.
 *     required: true
 *     schema:
 *       type: string
 *   - name: step_id
 *     in: path
 *     description: The workflows execution's step id.
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
 *     source: >-
 *       curl
 *       '{backend_url}/admin/workflows-executions/{workflow_id}/{transaction_id}/{step_id}/subscribe'
 *       \
 * 
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Workflows Executions
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema: {}
 * 
*/

