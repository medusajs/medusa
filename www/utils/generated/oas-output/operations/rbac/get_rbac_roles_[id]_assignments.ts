/**
 * @oas [get] /rbac/roles/{id}/assignments
 * operationId: GetRolesIdAssignments
 * summary: List Role's Assignments
 * description: Retrieve a list of a role's assignments, such as the users or invites that the role is assigned to. The assignments can be filtered by fields like `reference`, `reference_id`, `scope`, and `scope_id`. The assignments can also be paginated.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The role's ID.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/rbac/roles/{id}/assignments'
 * tags:
 *   - Roles
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRbacRoleAssignmentListResponse"
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
 * x-since: 2.22.3
 * 
*/

