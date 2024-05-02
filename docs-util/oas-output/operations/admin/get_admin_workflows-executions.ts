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
 *       schema:
 *         type: object
 *         required:
 *           - limit
 *           - fields
 *           - order
 *           - offset
 *           - transaction_id
 *           - workflow_id
 *         properties:
 *           limit:
 *             type: number
 *             title: limit
 *             description: The workflows execution's limit.
 *           fields:
 *             type: string
 *             title: fields
 *             description: The workflows execution's fields.
 *           order:
 *             type: string
 *             title: order
 *             description: The workflows execution's order.
 *           offset:
 *             type: number
 *             title: offset
 *             description: The workflows execution's offset.
 *           transaction_id:
 *             oneOf:
 *               - type: string
 *                 title: transaction_id
 *                 description: The workflows execution's transaction id.
 *               - type: array
 *                 description: The workflows execution's transaction id.
 *                 items:
 *                   type: string
 *                   title: transaction_id
 *                   description: The transaction id's details.
 *           workflow_id:
 *             oneOf:
 *               - type: string
 *                 title: workflow_id
 *                 description: The workflows execution's workflow id.
 *               - type: array
 *                 description: The workflows execution's workflow id.
 *                 items:
 *                   type: string
 *                   title: workflow_id
 *                   description: The workflow id's details.
 * 
*/

