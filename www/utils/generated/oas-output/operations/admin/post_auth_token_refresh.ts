/**
 * @oas [post] /auth/token/refresh
 * operationId: PostAdminAuthTokenRefresh
 * summary: Refresh Authentication Token
 * description: Refresh the authentication token of a user. This is useful after authenticating a user with a third-party service to ensure the token holds the new user's details, or when you don't want users to re-login every day.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/commerce-modules/auth/authentication-route#2-third-party-service-authenticate-flow
 *   description: Learn about third-party authentication flow.
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/auth/token/refresh' \
 *       -H 'Authorization: Bearer {token}'
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

