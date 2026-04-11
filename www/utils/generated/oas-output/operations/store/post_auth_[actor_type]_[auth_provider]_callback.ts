/**
 * @oas [post] /auth/customer/{auth_provider}/callback
 * operationId: PostActor_typeAuth_providerCallback
 * summary: Validate Authentication Callback
 * description: >
 *   This API route is used by your storefront or frontend application when a third-party provider redirects to it after authentication. It validates the authentication with the third-party provider and, if successful, returns an authentication token.
 *   All query parameters received from the third-party provider, such as `code`, `state`, and `error`, must be passed as query parameters to this route.
 *   
 *   You can decode the JWT token using libraries like [react-jwt](https://www.npmjs.com/package/react-jwt) in the storefront. If the decoded data doesn't 
 *   have an `actor_id` property, then you must register the customer using the Create Customer API route passing the token in the request's Authorization header.
 * externalDocs:
 *   url: https://docs.medusajs.com/resources/storefront-development/customers/third-party-login
 *   description: "Storefront development: Implement third-party (social) login."
 * x-authenticated: false
 * parameters:
 *   - name: auth_provider
 *     in: path
 *     description: The provider used for authentication.
 *     required: true
 *     schema:
 *       type: string
 *       example: "google"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: Google Provider
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 *       import { decodeToken } from "react-jwt"
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
 *       const token = await sdk.auth.callback(
 *         "customer",
 *         "google",
 *         {
 *           code: "123",
 *           state: "456"
 *         }
 *       )
 *       // all subsequent requests will use the token in the header
 * 
 *       const decodedToken = decodeToken(token) as { actor_id: string, user_metadata: Record<string, unknown> }
 *       
 *       const shouldCreateCustomer = decodedToken.actor_id === ""
 * 
 *       if (shouldCreateCustomer) {
 *         const { customer } = await sdk.store.customer.create({
 *           email: decodedToken.user_metadata.email as string,
 *         })
 * 
 *         // refresh auth token
 *         await sdk.auth.refresh()
 *         // all subsequent requests will use the new token in the header
 *       } else {
 *         // Customer already exists and is authenticated
 *       }
 *   - lang: TypeScript
 *     label: GitHub Provider
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 *       import { decodeToken } from "react-jwt"
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
 *       const token = await sdk.auth.callback(
 *         "customer",
 *         "github",
 *         {
 *           code: "123",
 *           state: "456"
 *         }
 *       )
 *       // all subsequent requests will use the token in the header
 * 
 *       const decodedToken = decodeToken(token) as { actor_id: string, user_metadata: Record<string, unknown> }
 *       
 *       const shouldCreateCustomer = decodedToken.actor_id === ""
 * 
 *       if (shouldCreateCustomer) {
 *         const { customer } = await sdk.store.customer.create({
 *           email: decodedToken.user_metadata.email as string,
 *         })
 * 
 *         // refresh auth token
 *         await sdk.auth.refresh()
 *         // all subsequent requests will use the new token in the header
 *       } else {
 *         // Customer already exists and is authenticated
 *       }
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

