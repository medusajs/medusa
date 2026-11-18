/**
 * @oas [post] /rbac/roles/{id}/users
 * operationId: PostRolesIdUsers
 * summary: Add Users to Role
 * description: Assign a role to one or more users. If the request is made within a scope, the assignments are constrained to that scope. You can only assign roles whose policies you have.
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
 *         description: The users to assign the role to.
 *         required:
 *           - users
 *         properties:
 *           users:
 *             type: array
 *             description: The IDs of the users to assign the role to.
 *             items:
 *               type: string
 *               title: users
 *               description: A user's ID.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/rbac/roles/{id}/users' \
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
 *           $ref: "#/components/schemas/AdminRbacRoleUsersResponse"
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

