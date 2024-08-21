/**
 * @oas [post] /auth/user/{auth_provider}/register
 * operationId: PostActor_typeAuth_provider_register
 * summary: Retrieve Registration JWT Token
 * description: A registration JWT token is used in the header of requests that create a user, such as the accept invitation request.
 *   This API route retrieves the JWT token of a user that hasn't been registered yet.
 * x-authenticated: false
 * parameters:
 *   - name: auth_provider
 *     in: path
 *     description: The provider used for authentication.
 *     required: true
 *     schema:
 *       type: string
 *       example: "emailpass"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/auth/user/{auth_provider}/register'
 * tags:
 *   - Auth
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

