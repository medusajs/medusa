/**
 * @oas [post] /rbac/policies/{id}
 * operationId: PostPoliciesId
 * summary: Update a Policy
 * description: Update an RBAC policy's details.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The policy's ID.
 *     required: true
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminUpdateRbacPolicy"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/rbac/policies/{id}'
 * tags:
 *   - Policies
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRbacPolicyResponse"
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
 * x-workflow: updateRbacPoliciesWorkflow
 * x-events: []
 * x-since: 2.22.3
 * 
*/

