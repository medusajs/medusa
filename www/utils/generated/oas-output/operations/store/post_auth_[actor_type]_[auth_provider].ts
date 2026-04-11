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
 *   url: https://docs.medusajs.com/resources/storefront-development/customers/login#1-using-a-jwt-token
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
 *         description: >
 *           The input data necessary for authentication. 
 * 
 *           For example, for email-pass authentication, pass `email` and `password` properties. 
 * 
 *           For the Google and GitHub authentication providers, you can pass `callback_url` to indicate the URL in the frontend that the customer should be redirected to after completing their authentication. This will override the provider's `callbackUrl` configurations in `medusa-config.ts`.
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
 *       const result = await sdk.auth.login(
 *         "customer",
 *         "emailpass",
 *         {
 *           email: "customer@gmail.com",
 *           password: "supersecret"
 *         }
 *       )
 * 
 *       if (typeof result !== "string") {
 *         alert("Authentication requires additional steps")
 *         // replace with the redirect logic of your application
 *         window.location.href = result.location
 *         return
 *       }
 * 
 *       // customer is now authenticated
 *       // all subsequent requests will use the token in the header
 *       const { customer } = await sdk.store.customer.retrieve()
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

