/**
 * @oas [post] /auth/customer/{auth_provider}
 * operationId: PostActor_typeAuth_provider
 * summary: Authenticate Customer
 * description: >
 *   Authenticate a customer and receive the JWT token to be used in the header of subsequent requests.
 * 
 * 
 *   When used with a third-party provider, such as Google, the request returns a `location` property. You redirect to the
 *   specified URL in your storefront to continue authentication with the third-party service.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/storefront-development/customers/login#1-using-a-jwt-token
 *   description: "Storefront development: How to login as a customer"
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
 *         title: input
 *         description: The input data necessary for authentication. For example, for email-pass authentication, pass `email` and `password` properties.
 * x-codeSamples:
 *   - lang: Shell
 *     label: EmailPass Provider
 *     source:  |-
 *       curl -X POST '{backend_url}/auth/customer/emailpass' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "email": "customer@gmail.com",
 *         "password": "supersecret"
 *       }'
 *   - lang: Bash
 *     label: Google Provider
 *     source:  |-
 *       curl -X POST '{backend_url}/auth/customer/google'
 * tags:
 *   - Auth
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           oneOf:
 *             - $ref: "#/components/schemas/AuthResponse"
 *             - $ref: "#/components/schemas/AuthCallbackResponse"
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

