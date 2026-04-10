/**
 * @oas [post] /cloud/auth/users
 * operationId: PostAuthUsers
 * summary: Create Auth
 * description: Create a auth.
 * x-authenticated: false
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/cloud/auth/users'
 * tags:
 *   - Auth
 * responses:
 *   "200":
 *     description: OK
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
 * x-workflow: createUserAccountWorkflow
 * x-events:
 *   - name: user.created
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the user
 *       }
 *       ```
 *     description: Emitted when users are created.
 *     deprecated: false
 * 
*/

