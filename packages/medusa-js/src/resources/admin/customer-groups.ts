import {
  AdminPostCustomerGroupsReq,
  AdminCustomerGroupsRes,
  AdminGetCustomerGroupsParams,
  AdminCustomerGroupsListRes,
  AdminPostCustomerGroupsGroupReq,
  AdminCustomerGroupsDeleteRes,
  AdminPostCustomerGroupsGroupCustomersBatchReq,
  AdminDeleteCustomerGroupsGroupCustomerBatchReq,
} from "@medusajs/medusa"
import qs from "qs"

import BaseResource from "../base"
import { ResponsePromise } from "../.."

class AdminCustomerGroupsResource extends BaseResource {
  /**
   * Create a customer group.
   *
   * @param payload - customer group info
   * @param customHeaders
   */
  create(
    payload: AdminPostCustomerGroupsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomerGroupsRes> {
    const path = `/admin/customer-groups`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieves a customer group.
   *
   * @param id - customer group id
   * @param customHeaders
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomerGroupsRes> {
    const path = `/admin/customer-groups/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }
  /**
   * Updates a customer group
   *
   * @param id - customer group id
   * @param payload - data to update customer group with
   * @param customHeaders
   */
  update(
    id: string,
    payload: AdminPostCustomerGroupsGroupReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomerGroupsRes> {
    const path = `/admin/customer-groups/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Deletes a cusotmer group.
   *
   * @param id - id of the customer gorup
   * @param customHeaders
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomerGroupsDeleteRes> {
    const path = `/admin/customer-groups/${id}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }

  /**
   * Lists customer groups.
   *
   * @param query optional
   * @param customHeaders
   */
  list(
    query?: AdminGetCustomerGroupsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomerGroupsListRes> {
    let path = `/admin/customer-groups`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/customer-groups?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * Add multiple customers to a customer group.
   *
   * @param id - customer group id
   * @param payload - an object which contains an array of customer ids which will be added to the group
   * @param customHeaders
   */
  addCustomers(
    id: string,
    payload: AdminPostCustomerGroupsGroupCustomersBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomerGroupsRes> {
    const path = `/admin/customer-groups/${id}/customers/batch`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Remove multiple customers from a customer group.
   *
   * @param id - customer group id
   * @param payload - an object which contains an array of customers ids which will be removed from the group
   * @param customHeaders
   */
  removeCustomers(
    id: string,
    payload: AdminDeleteCustomerGroupsGroupCustomerBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomerGroupsRes> {
    const path = `/admin/customer-groups/${id}/customers/batch`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }
}

export default AdminCustomerGroupsResource
