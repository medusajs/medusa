import {
  AdminDeleteUserRes,
  AdminGetUsersParams,
  AdminResetPasswordRequest,
  AdminResetPasswordTokenRequest,
  AdminUserRes,
  AdminUsersListRes,
} from "@medusajs/medusa"
import qs from "qs"
import {
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
  ResponsePromise,
} from "../.."
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin User API Routes](https://docs.medusajs.com/api/admin#users). All its method
 * are available in the JS Client under the `medusa.admin.users` property.
 *
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 *
 * A store can have more than one user, each having the same privileges. Admins can manage users, their passwords, and more.
 *
 * Related Guide: [How to manage users](https://docs.medusajs.com/modules/users/admin/manage-users).
 */
class AdminUsersResource extends BaseResource {
  /**
   * Generate a password token for an admin user with a given email. This also triggers the `user.password_reset` event. So, if you have a Notification Service installed
   * that can handle this event, a notification, such as an email, will be sent to the user. The token is triggered as part of the `user.password_reset` event's payload.
   * That token must be used later to reset the password using the {@link resetPassword} method.
   * @param {AdminResetPasswordTokenRequest} payload - The user's reset details.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<void>} Resolves when the token is generated successfully.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.users.sendResetPasswordToken({
   *   email: "user@example.com"
   * })
   * .then(() => {
   *   // successful
   * })
   * .catch(() => {
   *   // error occurred
   * })
   */
  sendResetPasswordToken(
    payload: AdminResetPasswordTokenRequest,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<void> {
    const path = `/admin/users/password-token`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Reset the password of an admin user using their reset password token. You must generate a reset password token first for the user using the {@link sendResetPasswordToken} method,
   * then use that token to reset the password in this method.
   * @param {AdminResetPasswordRequest} payload - The reset details.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminUserRes>} Resolves to the user's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.users.resetPassword({
   *   token: "supersecrettoken",
   *   password: "supersecret"
   * })
   * .then(({ user }) => {
   *   console.log(user.id);
   * })
   */
  resetPassword(
    payload: AdminResetPasswordRequest,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminUserRes> {
    const path = `admin/users/reset-password`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve an admin user's details.
   * @param {string} id - The user's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminUserRes>} Resolves to the user's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.users.retrieve(userId)
   * .then(({ user }) => {
   *   console.log(user.id);
   * })
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminUserRes> {
    const path = `/admin/users/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Create an admin user. The user has the same privileges as all admin users, and will be able to authenticate and perform admin functionalities right after creation.
   * @param {AdminCreateUserPayload} payload - The user to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminUserRes>} Resolves to the user's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.users.create({
   *   email: "user@example.com",
   *   password: "supersecret"
   * })
   * .then(({ user }) => {
   *   console.log(user.id);
   * })
   */
  create(
    payload: AdminCreateUserPayload,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminUserRes> {
    const path = `/admin/users`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update an admin user's details.
   * @param {string} id - The user's ID.
   * @param {AdminUpdateUserPayload} payload - The attributes to update in the user.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminUserRes>} Resolves to the user's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.users.update(userId, {
   *   first_name: "Marcellus"
   * })
   * .then(({ user }) => {
   *   console.log(user.id);
   * })
   */
  update(
    id: string,
    payload: AdminUpdateUserPayload,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminUserRes> {
    const path = `/admin/users/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a user. Once deleted, the user will not be able to authenticate or perform admin functionalities.
   * @param {string} id - The user's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDeleteUserRes>} Resolves to the deletion operation's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.users.delete(userId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDeleteUserRes> {
    const path = `/admin/users/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve all admin users.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminUsersListRes>} Resolves to the list of users.
   *
   * @example
   * To list users:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.users.list()
   * .then(({ users }) => {
   *   console.log(users.length);
   * })
   * ```
   *
   * By default, only the first `20` users are returned. You can control pagination by specifying the `limit` and `offset` properties:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.users.list({
   *   limit,
   *   offset
   * })
   * .then(({ users, limit, offset, count }) => {
   *   console.log(users.length);
   * })
   * ```
   */
  list(
    query?: AdminGetUsersParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminUsersListRes> {
    let path = `/admin/users`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminUsersResource
