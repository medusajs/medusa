import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminRbacPolicy, AdminRbacRole } from "./entities"
import { AdminUser } from "../../user"

export interface AdminRbacRoleResponse {
  /**
   * The role's details.
   */
  role: AdminRbacRole
}

export interface AdminRbacRoleListResponse
  extends PaginatedResponse<{
    /**
     * The list of roles.
     */
    roles: AdminRbacRole[]
  }> { }

export interface AdminRbacRoleDeleteResponse
  extends DeleteResponse<"rbac_role"> { }

export interface AdminRbacPolicyResponse {
  /**
   * The policy's details.
   */
  policy: AdminRbacPolicy
}

export interface AdminRbacPolicyListResponse
  extends PaginatedResponse<{
    /**
     * The list of policies.
     */
    policies: AdminRbacPolicy[]
  }> { }

export interface AdminRbacPolicyDeleteResponse
  extends DeleteResponse<"rbac_policy"> { }

export interface AdminRbacRoleUserListResponse
  extends PaginatedResponse<{
    /**
     * The list of users.
     */
    users: AdminUser[]
  }> { }

export interface AdminRbacRoleUsersResponse {
  /**
   * The list of users.
   */
  users: AdminUser[]
}

export interface AdminRbacRoleUsersDeleteResponse {
  /**
   * The IDs of the users that were removed.
   */
  ids: string[]
  /**
   * The type of the removed items.
   */
  object: "role_user"
  /**
   * Whether the users were removed successfully.
   */
  deleted: boolean
  extends DeleteResponse<"rbac_policy"> {}

export interface AdminRbacMePermissionsResponse {
  /**
   * The actor's effective `resource:operation` permissions, with wildcards already expanded.
   */
  permissions: string[]
}
