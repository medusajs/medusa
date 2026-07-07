/**
 * @oas [get] /admin/workflows-executions/{workflow_id}/{transaction_id}/subscribe
 * operationId: GetWorkflowsExecutionsWorkflow_idTransaction_idSubscribe
 * summary: Subscribe to Workflow Execution Events
 * description: Subscribe to workflow execution events for a specific workflow and transaction. This endpoint establishes a Server-Sent Events (SSE) connection, allowing clients to receive real-time
 *   updates about the workflow execution. The events include details such as the event type, workflow ID, transaction ID, step information, response, result, and any errors that occur during the
 *   execution.
 * x-authenticated: true
 * parameters:
 *   - name: workflow_id
 *     in: path
 *     description: The ID of the workflow to subscribe to.
 *     required: true
 *     schema:
 *       type: string
 *   - name: transaction_id
 *     in: path
 *     description: The ID of the workflow execution transaction to subscribe to.
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
 *       curl '{backend_url}/admin/workflows-executions/{workflow_id}/{transaction_id}/subscribe' \
 *       -H 'Authorization: Bearer {access_token}'
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

