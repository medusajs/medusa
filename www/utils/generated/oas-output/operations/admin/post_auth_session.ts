/**
 * @oas [post] /auth/session
 * operationId: PostSession
 * summary: Set Authentication Session
 * description: Set the cookie session ID of an admin user. The admin must be previously authenticated with the `/auth/user/{provider}` API route first,
 *   as the JWT token is required in the header of the request.
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/auth/session' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Auth
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AuthAdminSessionResponse"
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

