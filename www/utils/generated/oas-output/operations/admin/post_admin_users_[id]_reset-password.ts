/**
 * @oas [post] /admin/users/{id}/reset-password
 * operationId: PostUsersIdResetPassword
 * summary: Generate Reset Password Token for a User
 * x-sidebar-summary: Generate Reset Password Token
 * description: Generate a reset password token for a user. This is useful if another user wants to reset the password of a user. The reset password token can be used to reset the user's password. This route only emits the `auth.password_reset` event. You can listen to this event to send a reset password email to the user, for example.
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
 *       sdk.admin.user.generateResetPasswordToken("user_123")
 *       .then(({ token }) => {
 *         console.log(token)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/users/{id}/reset-password' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Users
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminUserResetPasswordTokenResponse"
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
 * x-since: 2.20.0
 * 
*/

