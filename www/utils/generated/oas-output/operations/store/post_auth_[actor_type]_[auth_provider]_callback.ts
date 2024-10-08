/**
 * @oas [post] /auth/customer/{auth_provider}/callback
 * operationId: PostActor_typeAuth_providerCallback
 * summary: Validate Authentication Callback
 * description: >
 *   This API route is used by your storefront or frontend application when a third-party provider redirects to it after authentication. 
 * 
 * 
 *   It validates the authentication with the third-party provider and, if successful, returns an authentication token.
 * 
 *   
 *   You can decode the JWT token using libraries like [react-jwt](https://www.npmjs.com/package/react-jwt) in the storefront. If the decoded data doesn't 
 *   have an `actor_id` property, then you must register the customer using the Create Customer API route passing the token in the request's Authorization header.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/storefront-development/customers/third-party-login
 *   description: "Storefront development: Implement third-party (social) login."
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
 *     label: Google Provider
 *     source: curl -X POST '{backend_url}/auth/customer/google/callback?code=123'
 *   - lang: Bash
 *     label: GitHub Provider
 *     source: curl -X POST '{backend_url}/auth/customer/github/callback?code=123'
 * tags:
 *   - Auth
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AuthResponse"
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
 * 
*/

