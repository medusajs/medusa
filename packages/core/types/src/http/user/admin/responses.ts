import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminRbacRole } from "../../rbac"
import { AdminUser } from "./entities"

export interface AdminUserResponse {
  /**
   * The user's details.
   */
  user: AdminUser
}

export interface AdminUserListResponse
  extends PaginatedResponse<{
    /**
     * The list of users.
     */
    users: AdminUser[]
  }> {}

export interface AdminUserDeleteResponse extends DeleteResponse<"user"> {}

export interface AdminUserAuthProvidersResponse {
  /**
   * The IDs of the auth providers the user can authenticate with, such as
   * `emailpass`.
   */
  providers: string[]
}

export interface AdminUserResetPasswordTokenResponse {
  /**
   * The generated reset password token. Append it to the admin's
   * `/reset-password` page as a `token` query parameter to build a link the
   * user can open to set a new password.
   *
   * The token is short-lived, can only be used once, and generating it
   * invalidates any reset password token previously issued for the user.
   */
  token: string
}

export interface AdminUserRoleListResponse
  extends PaginatedResponse<{
    /**
     * The list of roles.
     */
    roles: AdminRbacRole[]
  }> {}

export interface AdminUserRolesResponse {
  /**
   * The list of roles.
   */
  roles: AdminRbacRole[]
}

export interface AdminUserRoleDeleteResponse
  extends DeleteResponse<"user_role"> {}

export interface AdminUserRolesDeleteResponse {
  /**
   * The IDs of the roles that were removed.
   */
  ids: string[]
  /**
   * The type of the removed items.
   */
  object: "user_role"
  /**
   * Whether the roles were removed successfully.
   */
  deleted: boolean
}
