/**
 * @oas [post] /auth/{actor_type}/{auth_provider}/reset-password
 * operationId: PostActor_typeAuth_providerResetPassword
 * summary: Add Reset Password to [actor_type]
 * description: Add a Reset Password to a [actor_type]
 * x-authenticated: false
 * parameters:
 *   - name: actor_type
 *     in: path
 *     description: The [actor type]'s actor type.
 *     required: true
 *     schema:
 *       type: string
 *   - name: auth_provider
 *     in: path
 *     description: The [actor type]'s auth provider.
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
 *       sdk.auth.resetPassword(
 *         "customer",
 *         "emailpass",
 *         {
 *           identifier: "customer@gmail.com"
 *         }
 *       )
 *       .then(() => {
 *         // user receives token
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/auth/{actor_type}/{auth_provider}/reset-password'
 * tags:
 *   - "[actor_type]"
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
 * x-workflow: generateResetPasswordTokenWorkflow
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/ResetPasswordRequest"
 * x-events:
 *   - name: auth.password_reset
 *     payload: |-
 *       ```ts
 *       {
 *         entity_id, // The identifier of the user or customer. For example, an email address.
 *         actor_type, // The type of actor. For example, "customer", "user", or custom.
 *         token, // The generated token.
 *         metadata, // Optional custom metadata passed from the request.
 *       }
 *       ```
 *     description: |-
 *       Emitted when a reset password token is generated. You can listen to this event
 *       to send a reset password email to the user or customer, for example.
 *     deprecated: false
 * 
*/

