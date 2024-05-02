/**
 * @oas [post] /auth/{scope}/{auth_provider}/callback
 * operationId: PostScopeAuth_providerCallback
 * summary: Add Callbacks to [scope]
 * description: Add a list of callbacks to a [scope].
 * x-authenticated: false
 * parameters:
 *   - name: scope
 *     in: path
 *     description: The [scope]'s scope.
 *     required: true
 *     schema:
 *       type: string
 *   - name: auth_provider
 *     in: path
 *     description: The [scope]'s auth provider.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/auth/{scope}/{auth_provider}/callback'
 * tags:
 *   - "[scope]"
 * responses:
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema: {}
 * 
*/

