import {
  AdminCustomersListRes,
  AdminCustomersRes,
  AdminGetCustomersParams,
  AdminPostCustomersReq,
  AdminPostCustomersCustomerReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../.."
import BaseResource from "../base"

class AdminCustomersResource extends BaseResource {
  /**
   * Creates a customer
   * @param payload information of customer
   */
  create(payload: AdminPostCustomersReq): ResponsePromise<AdminCustomersRes> {
    const path = `/admin/customers`
    return this.client.request("POST", path, payload)
  }

  /**
   * Updates a customer
   * @param id customer id
   * @param payload data to update customer with
   */
  update(
    id: string,
    payload: AdminPostCustomersCustomerReq
  ): ResponsePromise<AdminCustomersRes> {
    const path = `/admin/customers/${id}`
    return this.client.request("POST", path, payload)
  }

  /**
   * Retrieves a customer
   * @param id customer id
   */
  retrieve(id: string): ResponsePromise<AdminCustomersRes> {
    const path = `/admin/customers/${id}`
    return this.client.request("GET", path)
  }

  /**
   * Lists customers
   * @param query optional
   */
  list(
    query?: AdminGetCustomersParams
  ): ResponsePromise<AdminCustomersListRes> {
    let path = `/admin/customers`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return `${key}=${value}`
      })

      path = `/admin/customers?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }
}

export default AdminCustomersResource
