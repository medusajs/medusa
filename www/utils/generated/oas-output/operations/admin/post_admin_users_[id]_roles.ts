/**
 * @oas [post] /admin/users/{id}/roles
 * operationId: PostUsersIdRoles
 * summary: Add Roles to User
 * description: Assign one or more roles to a user, optionally constrained to a scope. You can only assign roles whose policies you have.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The user's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminAssignUserRoles"
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
 *       sdk.admin.user.addRoles("user_123", {
 *         assignments: [{ role_id: "role_123" }]
 *       })
 *       .then(({ roles }) => {
 *         console.log(roles)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/users/{id}/roles' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Users
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
 * x-workflow: assignRolesWorkflow
 * x-events: []
 * x-since: 2.22.3
 * 
*/

