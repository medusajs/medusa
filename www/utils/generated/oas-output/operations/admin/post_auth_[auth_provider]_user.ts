/**
 * @oas [post] /auth/{auth_provider}/user
 * operationId: PostAuth_providerUser
 * summary: Create an Admin User for an Auth Provider
 * x-sidebar-summary: Create Admin User
 * description: Create an admin user for an auth provider. This is useful for providers like OIDC where the user is created in the provider and then needs to be created in Medusa. Be careful of using this endpoint with providers like Google or GitHub, as any one can sign up as an admin user. Make sure to disable these providers for admin users using the [http.authMethodsPerActor](https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers#configure-allowed-auth-providers-of-actor-types) configuration.
 * x-authenticated: false
 * parameters:
 *   - name: auth_provider
 *     in: path
 *     description: The ID of the auth provider to create the admin user for.
 *     required: true
 *     schema:
 *       type: string
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
 *       const token = await sdk.auth.callback("user", "okta", queryParams)
 *       await sdk.auth.createUser("okta", { Authorization: `Bearer ${token}` })
 *       await sdk.auth.refresh()
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/auth/okta/user'
 * tags:
 *   - "[auth_provider]"
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

