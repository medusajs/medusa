/**
 * @oas [post] /auth/customer/{auth_provider}/update
 * operationId: PostActor_typeAuth_providerUpdate
 * summary: Reset a Customer's Password
 * x-sidebar-summary: Reset Password
 * description: Reset a customer's password using a reset-password token generated with the [Generate Reset Password Token API route](https://docs.medusajs.com/api/store#auth_postactor_typeauth_providerresetpassword). You pass the token as a bearer token in the request's Authorization header.
 * externalDocs:
 *   url: https://docs.medusajs.com/resources/storefront-development/customers/reset-password#2-reset-password-page
 *   description: "Storefront development: How to create the reset password page."
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
 *         description: The input data necessary for authentication with the specified auth provider. For example, for email-pass authentication, pass `email` and `password` properties.
 *         example:
 *           email: "customer@gmail.com"
 *           password: "supersecret"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       let MEDUSA_BACKEND_URL = "http://localhost:9000"
 * 
 *       if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
 *         MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
 *       }
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: MEDUSA_BACKEND_URL,
 *         debug: process.env.NODE_ENV === "development",
 *         publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
 *       })
 * 
 *       sdk.auth.updateProvider(
 *         "customer",
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
 *       curl -X POST '{backend_url}/auth/customer/emailpass/update' \
 *       -H 'Content-Type: application/json' \
 *       -H 'Authorization: Bearer {token}' \
 *       --data-raw '{
 *         "email": "customer@gmail.com",
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

