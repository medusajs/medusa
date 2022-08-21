import {
  AdminDeleteUserRes,
  AdminResetPasswordRequest,
  AdminResetPasswordTokenRequest,
  AdminUserRes,
  AdminUsersListRes,
} from "@medusajs/medusa"
import {
  ResponsePromise,
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
} from "../.."
import BaseResource from "../base"

class AdminUsersResource extends BaseResource {
  /**
   * @description resets password by re-sending password token.
   * @param payload payload for generating reset-password token.
   * @param customHeaders
   * @returns
   */
  sendResetPasswordToken(
    payload: AdminResetPasswordTokenRequest,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<void> {
    const path = `/admin/users/password-token`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description resets the users password given the correct token.
   * @param payload reset password information.
   * @param customHeaders
   * @returns
   */
  resetPassword(
    payload: AdminResetPasswordRequest,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminUserRes> {
    const path = `admin/users/reset-password`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieves a given user
   * @param id id of the user
   * @param customHeaders
   * @returns the user
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminUserRes> {
    const path = `/admin/users/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @description creates a user with the provided information
   * @param payload user creation request body
   * @param customHeaders
   * @returns created user
   */
  create(
    payload: AdminCreateUserPayload,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminUserRes> {
    const path = `/admin/users`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * @description updates a given user
   * @param id id of the user to update
   * @param payload user update request body
   * @param customHeaders
   * @returns the updated user
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
   * @description deletes a user
   * @param id id of the user to be deleted
   * @param customHeaders
   * @returns delete response
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDeleteUserRes> {
    const path = `/admin/users/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * @description lists all users
   * @returns a list of all users
   */
  list(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminUsersListRes> {
    const path = `/admin/users`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminUsersResource
