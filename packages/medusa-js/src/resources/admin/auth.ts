import { AdminAuthRes, AdminPostAuthReq, AdminBearerAuthRes } from "@medusajs/medusa"
import { ResponsePromise } from "../../typings"
import JwtTokenManager from "../../jwt-token-manager"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Auth API Routes](https://docs.medusajs.com/api/admin#auth_getauth). All its method
 * are available in the JS Client under the `medusa.admin.auth` property.
 * 
 * The methods in this class allow admin users to manage their session, such as login or log out.
 * You can send authenticated requests for an admin user either using the Cookie header, their API token, or the JWT Token.
 * When you log the admin user in using the {@link createSession} method, the JS client will automatically attach the
 * cookie header in all subsequent requests.
 * 
 * Related Guide: [How to implement user profiles](https://docs.medusajs.com/modules/users/admin/manage-profile).
 */
class AdminAuthResource extends BaseResource {
  /**
   * Get the currently logged in user's details. Can also be used to check if there is an authenticated user.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminAuthRes>} Resolves to the logged-in user's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.auth.getSession()
   * .then(({ user }) => {
   *   console.log(user.id);
   * })
   */
  getSession(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminAuthRes> {
    const path = `/admin/auth`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Log out the user and remove their authentication session. This will only work if you're using Cookie session for authentication. If the API token is still passed in the header,
   * the user is still authorized to perform admin functionalities in other API Routes.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<void>} Resolves when user is logged out successfully.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in
   * medusa.admin.auth.deleteSession()
   */
  deleteSession(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<void> {
    const path = `/admin/auth`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Log a User in using their credentials. If the user is authenticated successfully, the cookie is automatically attached to subsequent requests sent with the JS Client.
   * @param {AdminPostAuthReq} payload - The credentials of the user.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminAuthRes>} Resolves to the user's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.admin.auth.createSession({
   *   email: "user@example.com",
   *   password: "supersecret"
   * })
   * .then(({ user }) => {
   *   console.log(user.id);
   * })
   */
  createSession(
    payload: AdminPostAuthReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminAuthRes> {
    const path = `/admin/auth`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Authenticate the user and retrieve a JWT token to use for subsequent authenticated requests.
   * @param {AdminPostAuthReq} payload - The credentials of the user.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminBearerAuthRes>} Resolves to the access token of the user, if they're authenticated successfully.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.admin.auth.getToken({
   *   email: 'user@example.com',
   *   password: 'supersecret'
   * })
   * .then(({ access_token }) => {
   *   console.log(access_token);
   * })
   */
  getToken(
    payload: AdminPostAuthReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminBearerAuthRes> {
    const path = `/admin/auth/token`
    return this.client.request("POST", path, payload, {}, customHeaders)
      .then((res) => {
        JwtTokenManager.registerJwt(res.access_token, "admin");
        
        return res
      });
  }
}

export default AdminAuthResource
