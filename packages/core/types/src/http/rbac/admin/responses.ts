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
  }> {}

export interface AdminRbacRoleDeleteResponse
  extends DeleteResponse<"rbac_role"> {}

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
  }> {}

export interface AdminRbacPolicyDeleteResponse
  extends DeleteResponse<"rbac_policy"> {}

export interface AdminRbacRoleUserListResponse
  extends PaginatedResponse<{
    /**
     * The list of users.
     */
    users: AdminUser[]
  }> {}

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
}

export interface AdminRbacPolicyRolesListResponse
  extends PaginatedResponse<{
    /**
     * The roles that include this policy.
     */
    roles: AdminRbacRole[]
  }> {}

export interface AdminRbacAssignableRolesListResponse {
  /**
   * The roles the authenticated actor is allowed to assign.
   */
  roles: Pick<AdminRbacRole, "id" | "name" | "description">[]
  /**
   * Total number of assignable roles after applying actor-coverage filtering.
   */
  count: number
}

export interface AdminRbacAssignablePoliciesListResponse {
  /**
   * The policies the authenticated actor is allowed to assign.
   */
  policies: Pick<
    AdminRbacPolicy,
    "id" | "key" | "resource" | "operation" | "description"
  >[]
  /**
   * Total number of assignable policies after applying actor-coverage filtering.
   */
  count: number
}

export interface AdminRbacPolicyDeleteResponse
  extends DeleteResponse<"rbac_policy"> {}

export interface AdminRbacMePermissionsResponse {
  /**
   * The actor's effective `resource:operation` permissions, with wildcards already expanded.
   */
  permissions: string[]
}
