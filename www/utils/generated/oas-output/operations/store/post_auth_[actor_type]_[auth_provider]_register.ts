/**
 * @oas [post] /auth/customer/{auth_provider}/register
 * operationId: PostActor_typeAuth_provider_register
 * summary: Retrieve Registration JWT Token
 * description: This API route retrieves a registration JWT token of a customer that hasn't been registered yet. The token is used in the header of requests that create a customer.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/storefront-development/customers/register
 *   description: "Storefront development: How to register a customer"
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
 *           email: "customer@gmail.com"
 *           password: "supersecret"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source:  |-
 *       curl -X POST '{backend_url}/auth/customer/emailpass/register' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "email": "customer@gmail.com",
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

