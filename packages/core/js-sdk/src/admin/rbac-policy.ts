import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class RbacPolicy {
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
   * This method retrieves a paginated list of RBAC policies. It sends a request to the
   * List RBAC Policies API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of RBAC policies.
   *
   * @example
   * To retrieve the list of policies:
   *
   * ```ts
   * sdk.admin.rbacPolicy.list()
   * .then(({ policies, count, limit, offset }) => {
   *   console.log(policies)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.rbacPolicy.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ policies, count, limit, offset }) => {
   *   console.log(policies)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each policy:
   *
   * ```ts
   * sdk.admin.rbacPolicy.list({
   *   fields: "id,key,resource,operation"
   * })
   * .then(({ policies, count, limit, offset }) => {
   *   console.log(policies)
   * })
   * ```
   */
  async list(
    queryParams?: HttpTypes.AdminRbacPolicyListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacPolicyListResponse>(
      `/admin/rbac/policies`,
      {
        query: queryParams,
        headers,
      }
    )
  }

  /**
   * This method retrieves an RBAC policy's details. It sends a request to the
   * Get RBAC Policy API route.
   *
   * @param id - The policy's ID.
   * @param query - Configure the fields to retrieve in the policy.
   * @param headers - Headers to pass in the request.
   * @returns The policy's details.
   *
   * @example
   * sdk.admin.rbacPolicy.retrieve("policy_123")
   * .then(({ policy }) => {
   *   console.log(policy)
   * })
   */
  async retrieve(
    id: string,
    query?: HttpTypes.AdminRbacPolicyParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacPolicyResponse>(
      `/admin/rbac/policies/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method creates an RBAC policy. It sends a request to the Create RBAC Policy
   * API route.
   *
   * @param body - The policy's details.
   * @param query - Configure the fields to retrieve in the created policy.
   * @param headers - Headers to pass in the request
   * @returns The created policy
   *
   * @example
   * sdk.admin.rbacPolicy.create({
   *   key: "product.read",
   *   resource: "product",
   *   operation: "read"
   * })
   * .then(({ policy }) => {
   *   console.log(policy)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateRbacPolicy,
    query?: HttpTypes.AdminRbacPolicyParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacPolicyResponse>(
      `/admin/rbac/policies`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates an RBAC policy's details. It sends a request to the
   * Update RBAC Policy API route.
   *
   * @param id - The policy's ID.
   * @param body - The data to update in the policy.
   * @param query - Configure the fields to retrieve in the policy.
   * @param headers - Headers to pass in the request.
   * @returns The policy's details.
   *
   * @example
   * sdk.admin.rbacPolicy.update("policy_123", {
   *   name: "Read Products",
   *   description: "Allows reading product information"
   * })
   * .then(({ policy }) => {
   *   console.log(policy)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateRbacPolicy,
    query?: HttpTypes.AdminRbacPolicyParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRbacPolicyResponse>(
      `/admin/rbac/policies/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method deletes an RBAC policy by its ID. It sends a request to the
   * Delete RBAC Policy API route.
   *
   * @param id - The policy's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.rbacPolicy.delete("policy_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminRbacPolicyDeleteResponse>(
      `/admin/rbac/policies/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }
}
