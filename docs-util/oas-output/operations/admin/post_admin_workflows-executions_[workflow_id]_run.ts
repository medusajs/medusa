/**
 * @oas [post] /admin/workflows-executions/{workflow_id}/run
 * operationId: PostWorkflowsExecutionsWorkflow_idRun
 * summary: Add Runs to Workflows Execution
 * description: Add a list of runs to a workflows execution.
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
 *         properties:
 *           input: {}
 *           transaction_id:
 *             type: string
 *             title: transaction_id
 *             description: The workflows execution's transaction id.
 *         required:
 *           - input
 *           - transaction_id
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: >-
 *       curl -X POST '{backend_url}/admin/workflows-executions/{workflow_id}/run'
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
 * 
*/

