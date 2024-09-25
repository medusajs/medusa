/**
 * @oas [post] /auth/user/{auth_provider}/update
 * operationId: PostActor_typeAuth_providerUpdate
 * summary: Reset an Admin User's Password
 * x-sidebar-summary: Reset Password
 * description: Reset a user's password. Generate the reset password token first using the Get Reset Password Token API route.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/commerce-modules/auth/authentication-route#reset-password-route
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
 *   - name: token
 *     in: query
 *     description: The reset password token received using the Get Reset Password API route.
 *     required: true
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         title: input
 *         description: The input data necessary for authentication. For example, for email-pass authentication, pass `email` and `password` properties.
 *         example:
 *           email: "admin@medusa-test.com"
 *           password: "supersecret"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source:  |-
 *       curl -X POST '{backend_url}/auth/user/emailpass/update?token=123' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "email": "admin@medusa-test.com",
 *         "password": "supersecret"
 *       }'
 * tags:
 *   - Auth
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - success
 *           description: Details on the reset password's status.
 *           properties:
 *             success:
 *               type: boolean
 *               title: success
 *               description: Whether the password was reset successfully.
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

