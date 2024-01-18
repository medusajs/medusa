import {
  AdminPostCustomerGroupsReq,
  AdminCustomerGroupsRes,
  AdminGetCustomerGroupsParams,
  AdminCustomerGroupsListRes,
  AdminPostCustomerGroupsGroupReq,
  AdminCustomerGroupsDeleteRes,
  AdminPostCustomerGroupsGroupCustomersBatchReq,
  AdminDeleteCustomerGroupsGroupCustomerBatchReq,
  AdminGetCustomerGroupsGroupParams,
  AdminCustomersListRes,
  AdminGetCustomersParams,
} from "@medusajs/medusa"
import qs from "qs"

import BaseResource from "../base"
import { ResponsePromise } from "../.."

/**
 * This class is used to send requests to [Admin Customer Group API Routes](https://docs.medusajs.com/api/admin#customer-groups). All its method
 * are available in the JS Client under the `medusa.admin.customerGroups` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Customer Groups can be used to organize customers that share similar data or attributes into dedicated groups.
 * This can be useful for different purposes such as setting a different price for a specific customer group.
 * 
 * Related Guide: [How to manage customer groups](https://docs.medusajs.com/modules/customers/admin/manage-customer-groups).
 */
class AdminCustomerGroupsResource extends BaseResource {
  /**
   * Create a customer group.
   * @param {AdminPostCustomerGroupsReq} payload - The data of the customer group to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCustomerGroupsRes>} Resolves to the customer group's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customerGroups.create({
   *   name: "VIP"
   * })
   * .then(({ customer_group }) => {
   *   console.log(customer_group.id);
   * })
   */
  create(
    payload: AdminPostCustomerGroupsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomerGroupsRes> {
    const path = `/admin/customer-groups`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve a customer group by its ID. You can expand the customer group's relations or select the fields that should be returned.
   * @param {string} id - The ID of the customer group.
   * @param {AdminGetCustomerGroupsGroupParams} query - Configurations to apply on the retrieved customer group.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCustomerGroupsRes>} Resolves to the customer group's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customerGroups.retrieve(customerGroupId)
   * .then(({ customer_group }) => {
   *   console.log(customer_group.id);
   * })
   */
  retrieve(
    id: string,
    query?: AdminGetCustomerGroupsGroupParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomerGroupsRes> {
    let path = `/admin/customer-groups/${id}`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
  /**
   * Update a customer group's details.
   * @param {string} id - The ID of the customer group.
   * @param {AdminPostCustomerGroupsGroupReq} payload - The attributes to update in the customer group.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCustomerGroupsRes>} Resolves to the customer group's details.
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
   * Delete a customer group. This doesn't delete the customers associated with the customer group.
   * @param {string} id - The ID of the customer group.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCustomerGroupsDeleteRes>} Resolves to the deletion operation details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customerGroups.delete(customerGroupId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomerGroupsDeleteRes> {
    const path = `/admin/customer-groups/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of customer groups. The customer groups can be filtered by fields such as `name` or `id`. The customer groups can also be sorted or paginated.
   * @param {AdminGetCustomerGroupsParams} query - Filters and pagination configurations to apply on the retrieved customer groups.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCustomerGroupsListRes>} Resolves to the list of customer groups with pagination fields.
   * 
   * @example
   * To list customer groups:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customerGroups.list()
   * .then(({ customer_groups, limit, offset, count }) => {
   *   console.log(customer_groups.length);
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the customer groups:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customerGroups.list({
   *   expand: "customers"
   * })
   * .then(({ customer_groups, limit, offset, count }) => {
   *   console.log(customer_groups.length);
   * })
   * ```
   * 
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customerGroups.list({
   *   "expand": "customers",
   *   limit,
   *   offset
   * })
   * .then(({ customer_groups, limit, offset, count }) => {
   *   console.log(customer_groups.length);
   * })
   * ```
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

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Add a list of customers to a customer group.
   * @param {string} id - The ID of the customer group.
   * @param {AdminPostCustomerGroupsGroupCustomersBatchReq} payload - The customers to add to the customer group.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCustomerGroupsRes>} Resolves to the customer group's details.
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
   * Remove a list of customers from a customer group. This doesn't delete the customer, only the association between the customer and the customer group.
   * @param {string} id - The ID of the customer group.
   * @param {AdminDeleteCustomerGroupsGroupCustomerBatchReq} payload - The customers to remove from the customer group.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCustomerGroupsRes>} Resolves to the customer group's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customerGroups.removeCustomers(customerGroupId, {
   *   customer_ids: [
   *     {
   *       id: customerId
   *     }
   *   ]
   * })
   * .then(({ customer_group }) => {
   *   console.log(customer_group.id);
   * })
   */
  removeCustomers(
    id: string,
    payload: AdminDeleteCustomerGroupsGroupCustomerBatchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomerGroupsRes> {
    const path = `/admin/customer-groups/${id}/customers/batch`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve a list of customers in a customer group. The customers can be filtered by the `q` field. The customers can also be paginated.
   * @param {string} id - The ID of the customer group.
   * @param {AdminGetCustomersParams} query - Filters and pagination configurations to apply on the retrieved customers.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCustomersListRes>} Resolves to the list of customers with pagination fields.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customerGroups.listCustomers(customerGroupId)
   * .then(({ customers }) => {
   *   console.log(customers.length);
   * })
   */
  listCustomers(
    id: string,
    query?: AdminGetCustomersParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomersListRes> {
    let path = `/admin/customer-groups/${id}/customers`

    if (query) {
      const queryString = qs.stringify(query)
      path += `?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminCustomerGroupsResource
