/**
 * @oas [post] /rbac/roles/{id}/policies
 * operationId: PostRolesIdPolicies
 * summary: Add Policies to Role
 * description: Add one or more policies to a role. You can only add policies that you have.
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
 *         description: The policies to add to the role.
 *         required:
 *           - policies
 *         properties:
 *           policies:
 *             type: array
 *             description: The IDs of the policies to add to the role.
 *             items:
 *               type: string
 *               title: policies
 *               description: A policy's ID.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/rbac/roles/{id}/policies' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "policies": [
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
 *           $ref: "#/components/schemas/AdminRbacRolePoliciesResponse"
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
 * x-workflow: createRbacRolePoliciesWorkflow
 * x-events: []
 * x-since: 2.22.3
 * 
*/

