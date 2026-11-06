/**
 * @oas [post] /rbac/policies
 * operationId: PostPolicies
 * summary: Create a Policy
 * description: Create an RBAC policy.
 * x-authenticated: false
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminCreateRbacPolicy"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/rbac/policies' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "key": "{value}",
 *         "resource": "{value}",
 *         "operation": "{value}"
 *       }'
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
 * x-workflow: createRbacPoliciesWorkflow
 * x-events: []
 * x-since: 2.22.3
 * 
*/

