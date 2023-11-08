import {
  AdminCustomersListRes,
  AdminCustomersRes,
  AdminGetCustomersParams,
  AdminPostCustomersReq,
  AdminPostCustomersCustomerReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../.."
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Customer API Routes](https://docs.medusajs.com/api/admin#customers). All its method
 * are available in the JS Client under the `medusa.admin.customers` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * Customers can either be created when they register through the {@link CustomersResource.create} method, or created by the admin using the {@link create} method.
 * 
 * Related Guide: [How to manage customers](https://docs.medusajs.com/modules/customers/admin/manage-customers).
 */
class AdminCustomersResource extends BaseResource {
  /**
   * Create a customer as an admin.
   * @param {AdminPostCustomersReq} payload - The customer to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCustomersRes>} Resolves to the customer's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customers.create({
   *   email: "user@example.com",
   *   first_name: "Caterina",
   *   last_name: "Yost",
   *   password: "supersecret"
   * })
   * .then(({ customer }) => {
   *   console.log(customer.id);
   * })
   */
  create(
    payload: AdminPostCustomersReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomersRes> {
    const path = `/admin/customers`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a customer's details.
   * @param {string} id - The customer's ID.
   * @param {AdminPostCustomersCustomerReq} payload - The attributes to update in the customer.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCustomersRes>} Resolves to the customer's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customers.update(customerId, {
   *   first_name: "Dolly"
   * })
   * .then(({ customer }) => {
   *   console.log(customer.id);
   * })
   */
  update(
    id: string,
    payload: AdminPostCustomersCustomerReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomersRes> {
    const path = `/admin/customers/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve the details of a customer.
   * @param {string} id - The customer's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCustomersRes>} Resolves to the customer's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customers.retrieve(customerId)
   * .then(({ customer }) => {
   *   console.log(customer.id);
   * })
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomersRes> {
    const path = `/admin/customers/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of Customers. The customers can be filtered by fields such as `q` or `groups`. The customers can also be paginated.
   * @param {AdminGetCustomersParams} query - Filters and pagination configurations to apply on the retrieved customers.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCustomersListRes>} Resolves to the list of customers with pagination fields.
   * 
   * @example
   * To list customers:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customers.list()
   * .then(({ customers, limit, offset, count }) => {
   *   console.log(customers.length);
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the customers:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customers.list({
   *   expand: "billing_address"
   * })
   * .then(({ customers, limit, offset, count }) => {
   *   console.log(customers.length);
   * })
   * ```
   * 
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.customers.list({
   *   expand: "billing_address",
   *   limit,
   *   offset
   * })
   * .then(({ customers, limit, offset, count }) => {
   *   console.log(customers.length);
   * })
   * ```
   */
  list(
    query?: AdminGetCustomersParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCustomersListRes> {
    let path = `/admin/customers`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/customers?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminCustomersResource
