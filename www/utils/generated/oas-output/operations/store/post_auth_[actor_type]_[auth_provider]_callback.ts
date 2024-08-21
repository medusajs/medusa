/**
 * @oas [post] /auth/customer/{auth_provider}/callback
 * operationId: PostActor_typeAuth_providerCallback
 * summary: Validate Authentication Callback
 * description: Third-party authentication providers, such as Google, require an API route to call once authentication with the third-party provider is finished.
 *   This API route validates callback for customers logged-in with third-party providers.
 * x-authenticated: false
 * parameters:
 *   - name: auth_provider
 *     in: path
 *     description: The provider used for authentication.
 *     required: true
 *     schema:
 *       type: string
 *       example: "google"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/auth/customer/{auth_provider}/callback'
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

