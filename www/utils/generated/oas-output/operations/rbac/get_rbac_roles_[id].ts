/**
 * @oas [get] /rbac/roles/{id}
 * operationId: GetRolesId
 * summary: Get a Role
 * description: Retrieve a role by its ID. You can expand the role's relations or select the fields that should be returned.
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
 *     source: curl '{backend_url}/rbac/roles/{id}'
 * tags:
 *   - Roles
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRbacRoleResponse"
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

