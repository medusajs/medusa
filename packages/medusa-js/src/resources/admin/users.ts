import {
  AdminResetPasswordTokenRequest,
  AdminResetPasswordRequest,
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUsersListRes,
  AdminUserRes,
  AdminDeleteUserRes,
} from "@medusajs/medusa"
import { ResponsePromise } from "../.."
import BaseResource from "../base"

class AdminUsersResource extends BaseResource {
  /**
   * @description resets password by re-sending password token.
   * @param payload payload for generating reset-password token.
   * @returns
   */
  sendResetPasswordToken(
    payload: AdminResetPasswordTokenRequest
  ): ResponsePromise<void> {
    const path = `/admin/users/password-token`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description resets the users password given the correct token.
   * @param payload reset password information.
   * @returns
   */
  resetPassword(
    payload: AdminResetPasswordRequest
  ): ResponsePromise<AdminUserRes> {
    const path = `admin/users/reset-password`
    return this.client.request("POST", path, payload)
  }

  /**
   * Retrieves a given user
   * @param id id of the user
   * @returns the user
   */
  retrieve(id: string): ResponsePromise<AdminUserRes> {
    const path = `/admin/users/${id}`
    return this.client.request("GET", path)
  }

  /**
   * @description creates a user with the provided information
   * @param payload user creation request body
   * @returns created user
   */
  create(payload: AdminCreateUserRequest): ResponsePromise<AdminUserRes> {
    const path = `/admin/users`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description updates a given user
   * @param id id of the user to update
   * @param payload user update request body
   * @returns the updated user
   */
  update(
    id: string,
    payload: AdminUpdateUserRequest
  ): ResponsePromise<AdminUserRes> {
    const path = `/admin/users/${id}`
    return this.client.request("POST", path, payload)
  }

  /**
   * @description deletes a user
   * @param id id of the user to be deleted
   * @returns delete response
   */
  delete(id: string): ResponsePromise<AdminDeleteUserRes> {
    const path = `/admin/users/${id}`
    return this.client.request("DELETE", path)
  }

  /**
   * @description lists all users
   * @returns a list of all users
   */
  list(): ResponsePromise<AdminUsersListRes> {
    const path = `/admin/users`
    return this.client.request("GET", path)
  }
}

export default AdminUsersResource
