/**
 * @oas [get] /admin/workflows-executions/{workflow_id}/{transaction_id}/{step_id}/subscribe
 * operationId: GetWorkflowsExecutionsWorkflow_idTransaction_idStep_idSubscribe
 * summary: Subscribe to Step of a Workflow's Execution
 * x-sidebar-summary: Subscribe to Step
 * description: |
 *   Subscribe to a step in a workflow's execution to receive real-time information about its status and data.
 *   This route returns an event stream that you can consume using the [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).
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
 *     source: |-
 *       curl '{backend_url}/admin/workflows-executions/{workflow_id}/{transaction_id}/{step_id}/subscribe' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Workflows Executions
 * responses:
 *   "200":
 *     description: Stream of the step's status.
 *     content:
 *       text/event-stream:
 *         schema:
 *           type: string
 *           description: The step's status update and data changes.
 *           example: |-
 *             event: success
 *              data: {}
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

