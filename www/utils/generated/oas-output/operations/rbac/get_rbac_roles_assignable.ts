/**
 * @oas [get] /rbac/roles/assignable
 * operationId: GetRolesAssignable
 * summary: List Assignable Roles
 * description: Retrieve the roles that the logged-in actor can assign. Pass the `scope` and `scope_id` query parameters to retrieve the roles the actor can assign within that scope.
 * x-authenticated: false
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/rbac/roles/assignable'
 * tags:
 *   - Roles
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRbacAssignableRolesListResponse"
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
 * x-workflow: getAssignableRolesWorkflow
 * x-events: []
 * x-since: 2.22.3
 * 
*/

