/**
 * @oas [delete] /rbac/roles/{id}/policies
 * operationId: DeleteRolesIdPolicies
 * summary: Remove Policy from Role
 * description: Remove a Policy from a role.
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
 *         description: SUMMARY
 *         required:
 *           - policies
 *         properties:
 *           policies:
 *             type: array
 *             description: The role's policies.
 *             items:
 *               type: string
 *               title: policies
 *               description: The policy's policies.
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

