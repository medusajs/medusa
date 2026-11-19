/**
 * @oas [post] /rbac/roles
 * operationId: PostRoles
 * summary: Create a Role
 * description: Create an RBAC role. You can only add policies to the role that you have.
 * x-authenticated: false
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The details of the role to create.
 *         required:
 *           - name
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
 *           policy_ids:
 *             type: array
 *             description: The IDs of the policies to add to the role.
 *             items:
 *               type: string
 *               title: policy_ids
 *               description: A policy's ID.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/rbac/roles' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Angelica"
 *       }'
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
 * x-workflow: createRbacRolesWorkflow
 * x-events: []
 * x-since: 2.22.3
 * 
*/

