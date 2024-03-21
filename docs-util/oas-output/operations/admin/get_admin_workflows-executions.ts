/**
 * @oas [get] /admin/workflows-executions
 * operationId: GetWorkflowsExecutions
 * summary: List Workflows Executions
 * description: Retrieve a list of workflows executions. The workflows executions
 *   can be filtered by fields such as `id`. The workflows executions can also be
 *   sorted or paginated.
 * x-authenticated: true
 * parameters: []
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/workflows-executions' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Workflows Executions
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

