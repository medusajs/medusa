/**
 * @oas [delete] /rbac/roles/{id}/users
 * operationId: DeleteRolesIdUsers
 * summary: Remove Users from Role
 * description: Unassign a role from one or more users.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The role's ID.
 *     required: true
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The users to unassign the role from.
 *         required:
 *           - users
 *         properties:
 *           users:
 *             type: array
 *             description: The IDs of the users to unassign the role from.
 *             items:
 *               type: string
 *               title: users
 *               description: A user's ID.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/rbac/roles/{id}/users' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "users": [
 *           "{value}"
 *         ]
 *       }'
 * tags:
 *   - Roles
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRbacRoleUsersDeleteResponse"
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
 * x-workflow: assignRolesWorkflow
 * x-events: []
 * x-since: 2.22.3
 * 
*/

