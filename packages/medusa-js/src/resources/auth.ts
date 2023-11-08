import {
  StoreGetAuthEmailRes,
  StorePostAuthReq,
  StoreAuthRes,
  StoreBearerAuthRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import JwtTokenManager from "../jwt-token-manager"
import BaseResource from "./base"

/**
 * This class is used to send requests to [Store Auth API Routes](https://docs.medusajs.com/api/store#auth). All its method
 * are available in the JS Client under the `medusa.auth` property.
 * 
 * The methods in this class allows you to manage a customer's session, such as login or log out.
 * You can send authenticated requests for a customer either using the Cookie header or using the JWT Token.
 * When you log the customer in using the {@link authenticate} method, the JS client will automatically attach the
 * cookie header in all subsequent requests.
 * 
 * Related Guide: [How to implement customer profiles in your storefront](https://docs.medusajs.com/modules/customers/storefront/implement-customer-profiles).
 */
class AuthResource extends BaseResource {
  /**
   * Authenticate a customer using their email and password. If the customer is authenticated successfully, the cookie is automatically attached to subsequent requests sent with the JS Client.
   * @param {StorePostAuthReq} payload - The credentials of the customer to authenticate.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreAuthRes>} Resolves to the customer's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.auth.authenticate({
   *   email: "user@example.com",
   *   password: "user@example.com"
   * })
   * .then(({ customer }) => {
   *   console.log(customer.id);
   * })
   */
  authenticate(payload: StorePostAuthReq, customHeaders: Record<string, any> = {}): ResponsePromise<StoreAuthRes> {
    const path = `/store/auth`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Log out the customer and remove their authentication session. This method requires {@link AuthResource.authenticate | customer authentication}.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<void>} Resolves when customer is logged out successfully.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.auth.deleteSession()
   * .then(() => {
   *   // customer logged out successfully
   * })
   */
   deleteSession(customHeaders: Record<string, any> = {}): ResponsePromise<void> {
    const path = `/store/auth`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  /**
   * Retrieve the details of the logged-in customer. Can also be used to check if there is an authenticated customer.
   * This method requires {@link AuthResource.authenticate | customer authentication}.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreAuthRes>} Resolves to the customer's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged
   * medusa.auth.getSession()
   * .then(({ customer }) => {
   *   console.log(customer.id);
   * })
   */
  getSession(customHeaders: Record<string, any> = {}): ResponsePromise<StoreAuthRes> {
    const path = `/store/auth`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Check if the email is already used by another registered customer. Can be used to validate a new customer's email.
   * @param {string} email - The email to check.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreGetAuthEmailRes>} Resolves to the result of the check.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.auth.exists("user@example.com")
   */
  exists(email: string, customHeaders: Record<string, any> = {}): ResponsePromise<StoreGetAuthEmailRes> {
    const path = `/store/auth/${email}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Authenticate the customer and retrieve a JWT token to use for subsequent authenticated requests.
   * @param {AdminPostAuthReq} payload - The credentials of the customer to authenticate.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreBearerAuthRes>} Resolves to the access token of the customer, if they're authenticated successfully.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.auth.getToken({
   *   email: 'user@example.com',
   *   password: 'supersecret'
   * })
   * .then(({ access_token }) => {
   *   console.log(access_token);
   * })
   */
  getToken(
    payload: StorePostAuthReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreBearerAuthRes> {
    const path = `/store/auth/token`
    return this.client.request("POST", path, payload, {}, customHeaders)
      .then((res) => {
        JwtTokenManager.registerJwt(res.access_token, "store");
        
        return res
      });
  }
}

export default AuthResource
