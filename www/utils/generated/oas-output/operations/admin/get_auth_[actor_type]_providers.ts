/**
 * @oas [get] /auth/user/providers
 * operationId: GetUserProviders
 * x-sidebar-summary: List Providers
 * summary: List Auth Providers for Admin Users
 * description: Retrieve a list of auth providers for the user actor type. This is useful to show the authentication option for the available providers.
 * x-authenticated: false
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
 *       const { providers } = await sdk.auth.listProviders("user")
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/auth/user/providers'
 * tags:
 *   - "Auth"
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AuthProvidersListResponse"
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

