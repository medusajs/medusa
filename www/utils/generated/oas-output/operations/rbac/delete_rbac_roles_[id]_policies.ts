/**
 * @oas [delete] /rbac/roles/{id}/policies
 * operationId: DeleteRolesIdPolicies
 * summary: Remove Policies from Role
 * description: Remove one or more policies from a role. You can only remove policies that you have.
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
 *         description: The policies to remove from the role.
 *         required:
 *           - policies
 *         properties:
 *           policies:
 *             type: array
 *             description: The IDs of the policies to remove from the role.
 *             items:
 *               type: string
 *               title: policies
 *               description: A policy's ID.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/rbac/roles/{id}/policies' \
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
 *           $ref: "#/components/schemas/AdminRbacRolePoliciesDeleteResponse"
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
 * x-workflow: deleteRbacRolePoliciesWorkflow
 * x-events: []
 * 
*/

