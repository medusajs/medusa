/**
 * @oas [post] /auth/{auth_provider}/user
 * operationId: PostAuth_providerUser
 * summary: Add User to [auth_provider]
 * description: Add a User to a [auth_provider]
 * x-authenticated: false
 * parameters:
 *   - name: auth_provider
 *     in: path
 *     description: The [auth provider]'s auth provider.
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
 *     source: curl -X POST '{backend_url}/auth/{auth_provider}/user'
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

