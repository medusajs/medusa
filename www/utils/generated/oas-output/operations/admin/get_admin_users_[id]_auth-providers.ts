/**
 * @oas [get] /admin/users/{id}/auth-providers
 * operationId: GetUsersIdAuthProviders
 * summary: List Auth Providers
 * description: Retrieve a list of auth providers in a user. The auth providers can be filtered by fields like FILTER FIELDS. The auth providers can also be paginated.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The user's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.user.listAuthProviders("user_123")
 *       .then(({ providers }) => {
 *         console.log(providers)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/users/{id}/auth-providers' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Users
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminUserAuthProvidersResponse"
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
 * x-since: 2.19.1
 * 
*/

