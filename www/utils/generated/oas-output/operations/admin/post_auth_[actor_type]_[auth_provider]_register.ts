/**
 * @oas [post] /auth/user/{auth_provider}/register
 * operationId: PostActor_typeAuth_provider_register
 * summary: Retrieve Registration JWT Token
 * description: This API route retrieves a registration JWT token of a user that hasn't been registered yet. The token is used in the header of requests that create a user, such as the Accept Invite API route.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/commerce-modules/auth/authentication-route#1-basic-authentication-flow
 *   description: Learn about the basic authentication flow.
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
 *         example:
 *           email: "admin@medusa-test.com"
 *           password: "supersecret"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source:  |-
 *       curl -X POST '{backend_url}/auth/user/emailpass/register' \
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
 *           $ref: "#/components/schemas/AuthResponse"
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

