/**
 * @oas [post] /auth/user/{auth_provider}/update
 * operationId: PostActor_typeAuth_providerUpdate
 * summary: Reset an Admin User's Password
 * x-sidebar-summary: Reset Password
 * description: Reset an admin user's password using a reset-password token generated with the [Generate Reset Password Token API route](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_providerresetpassword). You pass the token as a bearer token in the request's Authorization header.
 * externalDocs:
 *   url: https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route#reset-password-route
 *   description: Learn more about this API route.
 * x-authenticated: true
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
 *         title: input
 *         description: The input data necessary for authentication. For example, for email-pass authentication, pass `email` and `password` properties.
 *         example:
 *           email: "admin@medusa-test.com"
 *           password: "supersecret"
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
 *       sdk.auth.updateProvider(
 *         "user",
 *         "emailpass",
 *         {
 *           password: "supersecret"
 *         },
 *         token
 *       )
 *       .then(() => {
 *         // password updated
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source:  |-
 *       curl -X POST '{backend_url}/auth/user/emailpass/update' \
 *       -H 'Content-Type: application/json' \
 *       -H 'Authorization: Bearer {token}' \
 *       --data-raw '{
 *         "email": "admin@medusa-test.com",
 *         "password": "supersecret"
 *       }'
 * security:
 *   - reset_password: []
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

