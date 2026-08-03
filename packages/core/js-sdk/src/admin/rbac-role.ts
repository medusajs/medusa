import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

/**
 * This class is used to send requests to the RBAC Role API routes.
 *
 * @since 2.15.5
 */
export class RbacRole {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * This method retrieves a paginated list of RBAC roles. It sends a request to the
   * List RBAC Roles API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of RBAC roles.
   *
   * @example
   * To retrieve the list of roles:
   *
   * ```ts
   * sdk.admin.rbacRole.list()
   * .then(({ roles, count, limit, offset }) => {
   *   console.log(roles)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.rbacRole.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ roles, count, limit, offset }) => {
   *   console.log(roles)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each role:
   *
   * ```ts
   * sdk.admin.rbacRole.list({
   *   fields: "id,name,*policies"
   * })
   * .then(({ roles, count, limit, offset }) => {
   *   console.log(roles)
   * })
   * ```
   *
   * @tags rbac
   * @since 2.15.5
   */
  async list(
    queryParams?: HttpTypes.AdminRbacRoleListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacRoleListResponse>(
      `/rbac/roles`,
      {
        query: queryParams,
        headers,
      }
    )
  }

  /**
   * This method retrieves an RBAC role's details. It sends a request to the
   * Get RBAC Role API route.
   *
   * @param id - The role's ID.
   * @param query - Configure the fields to retrieve in the role.
   * @param headers - Headers to pass in the request.
   * @returns The role's details.
   *
   * @example
   * sdk.admin.rbacRole.retrieve("role_123")
   * .then(({ role }) => {
   *   console.log(role)
   * })
   *
   * @tags rbac
   * @since 2.15.5
   */
  async retrieve(
    id: string,
    query?: HttpTypes.AdminRbacRoleParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacRoleResponse>(
      `/rbac/roles/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method creates an RBAC role. It sends a request to the Create RBAC Role
   * API route.
   *
   * @param body - The role's details.
   * @param query - Configure the fields to retrieve in the created role.
   * @param headers - Headers to pass in the request
   * @returns The created role
   *
   * @example
   * sdk.admin.rbacRole.create({
   *   name: "Editor",
   *   description: "Can edit content"
   * })
   * .then(({ role }) => {
   *   console.log(role)
   * })
   *
   * @tags rbac
   * @since 2.15.5
   */
  async create(
    body: HttpTypes.AdminCreateRbacRole,
    query?: HttpTypes.AdminRbacRoleParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacRoleResponse>(
      `/rbac/roles`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates an RBAC role's details. It sends a request to the
   * Update RBAC Role API route.
   *
   * @param id - The role's ID.
   * @param body - The data to update in the role.
   * @param query - Configure the fields to retrieve in the role.
   * @param headers - Headers to pass in the request.
   * @returns The role's details.
   *
   * @example
   * sdk.admin.rbacRole.update("role_123", {
   *   name: "Senior Editor"
   * })
   * .then(({ role }) => {
   *   console.log(role)
   * })
   *
   * @tags rbac
   * @since 2.15.5
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateRbacRole,
    query?: HttpTypes.AdminRbacRoleParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacRoleResponse>(
      `/rbac/roles/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes an RBAC role by its ID. It sends a request to the
   * Delete RBAC Role API route.
   *
   * @param id - The role's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.rbacRole.delete("role_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminRbacRoleDeleteResponse>(
      `/rbac/roles/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method retrieves a paginated list of policies associated with an RBAC role.
   * It sends a request to the List Role Policies API route.
   *
   * @param roleId - The role's ID.
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of policies.
   *
   * @example
   * sdk.admin.rbacRole.listPolicies("role_123")
   * .then(({ policies, count, limit, offset }) => {
   *   console.log(policies)
   * })
   */
  async listPolicies(
    roleId: string,
    queryParams?: HttpTypes.AdminRbacPolicyListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacPolicyListResponse>(
      `/rbac/roles/${roleId}/policies`,
      {
        query: queryParams,
        headers,
      }
    )
  }

  /**
   * This method retrieves a paginated list of users associated with an RBAC role.
   * It sends a request to the List Role Users API route.
   *
   * @param roleId - The role's ID.
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of users.
   *
   * @example
   * sdk.admin.rbacRole.listUsers("role_123")
   * .then(({ users, count, limit, offset }) => {
   *   console.log(users)
   * })
   */
  async listUsers(
    roleId: string,
    queryParams?: HttpTypes.AdminRbacRoleUserListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacRoleUserListResponse>(
      `/rbac/roles/${roleId}/users`,
      {
        query: queryParams,
        headers,
      }
    )
  }

  /**
   * This method adds users to an RBAC role. It sends a request to the
   * Add Role Users API route.
   *
   * @param roleId - The role's ID.
   * @param body - The users to add to the role.
   * @param headers - Headers to pass in the request.
   * @returns The role's users.
   *
   * @example
   * sdk.admin.rbacRole.addUsers("role_123", {
   *   users: ["user_123"]
   * })
   * .then(({ users }) => {
   *   console.log(users)
   * })
   */
  async addUsers(
    roleId: string,
    body: HttpTypes.AdminAssignRoleUsers,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacRoleUsersResponse>(
      `/rbac/roles/${roleId}/users`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  /**
   * This method removes users from an RBAC role. It sends a request to the
   * Remove Role Users API route.
   *
   * @param roleId - The role's ID.
   * @param body - The users to remove from the role.
   * @param headers - Headers to pass in the request.
   * @returns The removal's details.
   *
   * @example
   * sdk.admin.rbacRole.removeUsers("role_123", {
   *   users: ["user_123"]
   * })
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async removeUsers(
    roleId: string,
    body: HttpTypes.AdminRemoveRoleUsers,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacRoleUsersDeleteResponse>(
      `/rbac/roles/${roleId}/users`,
      {
        method: "DELETE",
        headers,
        body,
      }
    )
  }

  /**
   * This method retrieves a paginated list of an RBAC role's assignments. An
   * assignment links the role to any entity (for example a user or an invite).
   * It sends a request to the List Role Assignments API route.
   *
   * @param roleId - The role's ID.
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of assignments.
   *
   * @example
   * sdk.admin.rbacRole.listAssignments("role_123", {
   *   reference: "user"
   * })
   * .then(({ assignments, count, limit, offset }) => {
   *   console.log(assignments)
   * })
   */
  async listAssignments(
    roleId: string,
    queryParams?: HttpTypes.AdminRbacRoleAssignmentListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacRoleAssignmentListResponse>(
      `/rbac/roles/${roleId}/assignments`,
      {
        query: queryParams,
        headers,
      }
    )
  }

  /**
   * This method assigns an RBAC role to one or more entities of a given
   * reference type. It sends a request to the Create Role Assignments API
   * route.
   *
   * @param roleId - The role's ID.
   * @param body - The reference type and the IDs of the entities to assign the role to.
   * @param headers - Headers to pass in the request.
   * @returns The role's assignments for the provided reference type.
   *
   * @example
   * sdk.admin.rbacRole.addAssignments("role_123", {
   *   reference: "user",
   *   reference_ids: ["user_123"]
   * })
   * .then(({ assignments }) => {
   *   console.log(assignments)
   * })
   */
  async addAssignments(
    roleId: string,
    body: HttpTypes.AdminCreateRoleAssignments,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacRoleAssignmentsResponse>(
      `/rbac/roles/${roleId}/assignments`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  /**
   * This method removes an RBAC role from one or more entities of a given
   * reference type. It sends a request to the Remove Role Assignments API
   * route.
   *
   * @param roleId - The role's ID.
   * @param body - The reference type and the IDs of the entities to remove the role from.
   * @param headers - Headers to pass in the request.
   * @returns The removal's details.
   *
   * @example
   * sdk.admin.rbacRole.removeAssignments("role_123", {
   *   reference: "user",
   *   reference_ids: ["user_123"]
   * })
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async removeAssignments(
    roleId: string,
    body: HttpTypes.AdminRemoveRoleAssignments,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacRoleAssignmentsDeleteResponse>(
      `/rbac/roles/${roleId}/assignments`,
      {
        method: "DELETE",
        headers,
        body,
      }
    )
  }

  /**
   * This method adds policies to an RBAC role. It sends a request to the
   * Add Role Policies API route.
   *
   * @param roleId - The role's ID.
   * @param body - The policies to add to the role.
   * @param headers - Headers to pass in the request.
   * @returns The updated role with policies.
   *
   * @example
   * sdk.admin.rbacRole.addPolicies("role_123", {
   *   policies: ["policy_123", "policy_456"]
   * })
   * .then(({ policies }) => {
   *   console.log(policies)
   * })
   */
  async addPolicies(
    roleId: string,
    body: HttpTypes.AdminAddRolePolicies,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacPolicyListResponse>(
      `/rbac/roles/${roleId}/policies`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  /**
   * This method removes a policy from an RBAC role. It sends a request to the
   * Remove Role Policy API route.
   *
   * @param roleId - The role's ID.
   * @param policyId - The policy's ID to remove.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.rbacRole.removePolicy("role_123", "policy_456")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async removePolicy(
    roleId: string,
    policyId: string,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacPolicyDeleteResponse>(
      `/rbac/roles/${roleId}/policies/${policyId}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * Retrieves the authenticated actor's resolved permission set: a flat list
   * of `resource:operation` strings with wildcards already expanded.
   *
   * @param headers - Headers to pass in the request.
   * @returns The flat permission list.
   *
   * @example
   * sdk.admin.rbacRole.mePermissions().then(({ permissions }) => {
   *   console.log(permissions) // ["product:read", "customer:read", ...]
   * })
   */
  async mePermissions(headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminRbacMePermissionsResponse>(
      `/rbac/me/permissions`,
      {
        method: "GET",
        headers,
      }
    )
  }

  /**
   * Lists the roles the authenticated actor is allowed to assign.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The assignable roles.
   */
  async listAssignable(
    queryParams?: HttpTypes.AdminRbacRoleListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacAssignableRolesListResponse>(
      `/rbac/roles/assignable`,
      {
        method: "GET",
        query: queryParams,
        headers,
      }
    )
  }
}
