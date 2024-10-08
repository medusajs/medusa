/**
 * @oas [post] /auth/user/{auth_provider}
 * operationId: PostActor_typeAuth_provider
 * summary: Authenticate User
 * description: >
 *   Authenticate a user and receive the JWT token to be used in the header of subsequent requests.
 * 
 * 
 *   When used with a third-party provider, such as Google, the request returns a `location` property. You redirect to the
 *   specified URL in your frontend to continue authentication with the third-party service.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/commerce-modules/auth/authentication-route#types-of-authentication-flows
 *   description: Learn about different authentication flows.
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
 *       curl -X POST '{backend_url}/auth/user/emailpass' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "email": "admin@medusa-test.com",
 *         "password": "supersecret"
 *       }'
 *   - lang: Bash
 *     label: Google Provider
 *     source:  |-
 *       curl -X POST '{backend_url}/auth/user/google'
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

