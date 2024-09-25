/**
 * @oas [post] /auth/customer/{auth_provider}/reset-password
 * operationId: PostActor_typeAuth_providerResetPassword
 * summary: Generate Reset Password Token for Customer
 * x-sidebar-summary: Generate Reset Password Token
 * description: >
 *   Generate a reset password token for a customer. This API route emits the `auth.password_reset` event, passing it the token as a payload. You can listen to that event and send the user a notification. The notification should have a URL that accepts a `token` query parameter.
 * 
 * 
 *    Use the generated token to update the user's password using the Reset Password API route.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/storefront-development/customers/reset-password#1-request-reset-password-page
 *   description: "Storefront development: How to create the request reset password page."
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
 *         description: The customer's identifier for the selected auth provider. For example, for the `emailpass` auth provider, the value is the customer's email.
 *         example: "customer@gmail.com"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source:  |-
 *       curl -X POST '{backend_url}/auth/customer/emailpass/reset-password' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "identifier": "customer@gmail.com"
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

