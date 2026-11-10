/**
 * @oas [delete] /rbac/roles/{id}/policies/{policy_id}
 * operationId: DeleteRolesIdPoliciesPolicy_id
 * summary: Remove Policy from Role
 * description: Remove a policy from a role. You can only remove policies that you have, the same as when adding them.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The role's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: policy_id
 *     in: path
 *     description: The role's policy id.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X DELETE '{backend_url}/rbac/roles/{id}/policies/{policy_id}'
 * tags:
 *   - Roles
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRbacRolePolicyDeleteResponse"
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
 * x-since: 2.22.3
 * 
*/

