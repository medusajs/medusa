/**
 * @oas [get] /admin/audit-logs
 * operationId: GetAuditLogs
 * summary: List Audit Logs
 * description: Retrieve a list of audit logs. The audit logs can be filtered by fields such as `id`. The audit logs can also be sorted or paginated.
 * x-authenticated: true
 * parameters:
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: order
 *     in: query
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: q
 *     in: query
 *     description: The audit log's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The audit log's q.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The audit log's ID.
 *         - type: array
 *           description: The audit log's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: actor_type
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: actor_type
 *           description: The audit log's actor type.
 *         - type: array
 *           description: The audit log's actor type.
 *           items:
 *             type: string
 *             title: actor_type
 *             description: The actor type's details.
 *   - name: actor_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: actor_id
 *           description: The audit log's actor id.
 *         - type: array
 *           description: The audit log's actor id.
 *           items:
 *             type: string
 *             title: actor_id
 *             description: The actor id's details.
 *   - name: action
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: action
 *           description: The audit log's action.
 *         - type: array
 *           description: The audit log's action.
 *           items:
 *             type: string
 *             title: action
 *             description: The action's details.
 *   - name: resource_type
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: resource_type
 *           description: The audit log's resource type.
 *         - type: array
 *           description: The audit log's resource type.
 *           items:
 *             type: string
 *             title: resource_type
 *             description: The resource type's details.
 *   - name: resource_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: resource_id
 *           description: The audit log's resource id.
 *         - type: array
 *           description: The audit log's resource id.
 *           items:
 *             type: string
 *             title: resource_id
 *             description: The resource id's details.
 *   - name: outcome
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: outcome
 *           description: The audit log's outcome.
 *         - type: string
 *           title: outcome
 *           description: The audit log's outcome.
 *         - type: string
 *           title: outcome
 *           description: The audit log's outcome.
 *         - type: array
 *           description: The audit log's outcome.
 *           items:
 *             type: string
 *             description: The outcome's details.
 *             enum:
 *               - succeeded
 *               - denied
 *               - failed
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. Without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
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
 *       sdk.admin.auditLog.list()
 *       .then(({ audit_logs, count, limit, offset }) => {
 *         console.log(audit_logs)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/audit-logs' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Audit Logs
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           allOf:
 *             - type: object
 *               description: SUMMARY
 *               required:
 *                 - limit
 *                 - offset
 *                 - count
 *               properties:
 *                 limit:
 *                   type: number
 *                   title: limit
 *                   description: The maximum number of items retrieved.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The number of items to skip before retrieving the returned items.
 *                 count:
 *                   type: number
 *                   title: count
 *                   description: The total number of items.
 *                 estimate_count:
 *                   type: number
 *                   title: estimate_count
 *                   description: The audit log's estimate count.
 *                   deprecated: true
 *                   x-featureFlag: index_engine
 *             - type: object
 *               description: SUMMARY
 *               required:
 *                 - audit_logs
 *               properties:
 *                 audit_logs:
 *                   type: array
 *                   description: The list of audit logs.
 *                   items:
 *                     $ref: "#/components/schemas/AdminAuditLog"
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
 * x-since: 2.23.0
 * 
*/

