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

class AdminCustomersResource extends BaseResource {
  /**
   * Creates a customer
   * @param payload information of customer
   * @param customHeaders
   */
  create(payload: AdminPostCustomersReq, customHeaders: Record<string, any> = {}): ResponsePromise<AdminCustomersRes> {
    const path = `/admin/customers`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Updates a customer
   * @param id customer id
   * @param payload data to update customer with
   * @param customHeaders
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
   * Retrieves a customer
   * @param id customer id
   * @param customHeaders
   */
  retrieve(id: string, customHeaders: Record<string, any> = {}): ResponsePromise<AdminCustomersRes> {
    const path = `/admin/customers/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  /**
   * Lists customers
   * @param query optional
   * @param customHeaders
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

    return this.client.request("GET", path, {}, {}, customHeaders)
  }
}

export default AdminCustomersResource
