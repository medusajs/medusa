import {
  AdminCustomersListRes,
  AdminCustomersRes,
  AdminGetCustomersParams,
  AdminPostCustomersReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../.."
import BaseResource from "../base"

class AdminCustomersResource extends BaseResource {
  /**
   * Creates a customer
   * @param {AdminPostCustomersReq} payload information of customer
   * @return { ResponsePromise<AdminCustomersRes>}
   */
  create(payload: AdminPostCustomersReq): ResponsePromise<AdminCustomersRes> {
    const path = `/admin/customers`
    return this.client.request("POST", path, payload)
  }

  /**
   * Updates a customer
   * @param {string} id customer id
   * @param {AdminPostCustomersReq} payload data to update customer with
   * @return { ResponsePromise<AdminCustomersRes>}
   */
  update(
    id: string,
    payload: AdminPostCustomersReq
  ): ResponsePromise<AdminCustomersRes> {
    const path = `/admin/customers/${id}`
    return this.client.request("POST", path, payload)
  }

  /**
   * Retrieves a customer
   * @param {string} id customer id
   * @return { ResponsePromise<AdminCustomersRes>}
   */
  retrieve(id: string): ResponsePromise<AdminCustomersRes> {
    const path = `/admin/customers/${id}`
    return this.client.request("GET", path)
  }

  /**
   * Lists customers
   * @param {AdminGetCustomersParams} query optional
   * @return { ResponsePromise<AdminCustomersRes>}
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
