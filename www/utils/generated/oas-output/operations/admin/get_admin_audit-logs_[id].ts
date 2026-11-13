/**
 * @oas [get] /admin/audit-logs/{id}
 * operationId: GetAuditLogsId
 * summary: Get a Audit Log
 * description: Retrieve a audit log by its ID. You can expand the audit log's relations or select the fields that should be returned.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The audit log's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.auditLog.retrieve("audlog_123")
 *       .then(({ audit_log }) => {
 *         console.log(audit_log)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/audit-logs/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Audit Logs
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminAuditLogResponse"
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
 * x-allowed:
 *   - id
 *   - started_at
 *   - ended_at
 *   - actor_type
 *   - actor_id
 *   - impersonator_id
 *   - action
 *   - resource_type
 *   - resource_id
 *   - outcome
 *   - request
 *   - request_data
 *   - response_data
 *   - metadata
 * 
*/

