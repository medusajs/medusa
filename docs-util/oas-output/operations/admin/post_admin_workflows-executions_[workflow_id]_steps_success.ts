/**
 * @oas [post] /admin/workflows-executions/{workflow_id}/steps/success
 * operationId: PostWorkflowsExecutionsWorkflow_idStepsSuccess
 * summary: Add Successes to Workflows Execution
 * description: Add a list of successes to a workflows execution.
 * x-authenticated: true
 * parameters:
 *   - name: workflow_id
 *     in: path
 *     description: The workflows execution's workflow id.
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
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - transaction_id
 *           - step_id
 *           - response
 *           - compensate_input
 *           - action
 *         properties:
 *           transaction_id:
 *             type: string
 *             title: transaction_id
 *             description: The workflows execution's transaction id.
 *           step_id:
 *             type: string
 *             title: step_id
 *             description: The workflows execution's step id.
 *           response: {}
 *           compensate_input: {}
 *           action:
 *             enum:
 *               - invoke
 *               - compensate
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: >-
 *       curl -X POST
 *       '{backend_url}/admin/workflows-executions/{workflow_id}/steps/success' \
 * 
 *       -H 'x-medusa-access-token: {api_token}' \
 * 
 *       -H 'Content-Type: application/json' \
 * 
 *       --data-raw '{
 *         "transaction_id": "{value}",
 *         "step_id": "{value}"
 *       }'
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
 * 
*/

