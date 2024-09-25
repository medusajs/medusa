/**
 * @oas [post] /auth/user/{auth_provider}/reset-password
 * operationId: PostActor_typeAuth_providerResetPassword
 * summary: Generate Reset Password Token for Admin User
 * x-sidebar-summary: Generate Reset Password Token
 * description: >
 *   Generate a reset password token for an admin user. This API route emits the `` event, passing it the token as a payload. You can listen to that event and send the user a notification. The notification should have a URL that accepts a `token` query parameter.
 * 
 * 
 *    Use the generated token to update the user's password using the Reset Password API route.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/commerce-modules/auth/authentication-route#generate-reset-password-token-route
 *   description: Learn more about this API route.
 * x-authenticated: false
 * parameters:
 *   - name: auth_provider
 *     in: path
 *     description: The provider used for authentication.
 *     required: true
 *     schema:
 *       type: string
 *       example: "emailpass"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         title: identifier
 *         description: The user's identifier for the selected auth provider. For example, for the `emailpass` auth provider, the value is the user's email.
 *         example: "admin@medusa-test.com"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source:  |-
 *       curl -X POST '{backend_url}/auth/user/emailpass/reset-password' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "identifier": "admin@medusa-test.com"
 *       }'
 * tags:
 *   - Auth
 * responses:
 *   "201":
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
 * 
*/

