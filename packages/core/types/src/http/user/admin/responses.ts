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
