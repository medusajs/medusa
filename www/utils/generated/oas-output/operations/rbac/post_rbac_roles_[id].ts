/**
 * @oas [post] /rbac/roles/{id}
 * operationId: PostRolesId
 * summary: Update a Role
 * description: Update an RBAC role's details.
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
 *         description: The details to update in the role.
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The role's name.
 *           description:
 *             type: string
 *             title: description
 *             description: The role's description.
 *           metadata:
 *             type: object
 *             description: The role's metadata.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/rbac/roles/{id}'
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
 * x-workflow: updateRbacRolesWorkflow
 * x-events: []
 * x-since: 2.22.3
 * 
*/

