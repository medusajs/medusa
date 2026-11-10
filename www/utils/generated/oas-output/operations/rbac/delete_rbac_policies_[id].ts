/**
 * @oas [delete] /rbac/policies/{id}
 * operationId: DeletePoliciesId
 * summary: Delete a Policy
 * description: Delete an RBAC policy.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The policy's ID.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X DELETE '{backend_url}/rbac/policies/{id}'
 * tags:
 *   - Policies
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRbacPolicyDeleteResponse"
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
 * x-workflow: deleteRbacPoliciesWorkflow
 * x-events: []
 * x-since: 2.22.3
 * 
*/

