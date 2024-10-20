/**
 * @oas [get] /admin/workflows-executions/{workflow_id}/{transaction_id}
 * operationId: GetWorkflowsExecutionsWorkflow_idTransaction_id
 * summary: Get Workflow Execution's Details
 * x-sidebar-summary: Get Exection
 * description: Get the details of the workflow's execution.
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
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/workflows-executions/{workflow_id}/{transaction_id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Workflows Executions
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminWorkflowExecutionResponse"
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

