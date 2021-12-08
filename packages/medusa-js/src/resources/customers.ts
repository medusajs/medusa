import {
  StoreCustomersListOrdersRes,
  StoreCustomersRes,
  StoreGetCustomersCustomerOrdersParams,
  StorePostCustomersCustomerPasswordTokenReq,
  StorePostCustomersCustomerReq,
  StorePostCustomersReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import AddressesResource from "./addresses"
import BaseResource from "./base"
import PaymentMethodsResource from "./payment-methods"

class CustomerResource extends BaseResource {
  public paymentMethods = new PaymentMethodsResource(this.client)
  public addresses = new AddressesResource(this.client)

  /**
   * Creates a customer
   * @param {StorePostCustomersReq} payload information of customer
   * @return { ResponsePromise<StoreCustomersRes>}
   */
  create(payload: StorePostCustomersReq): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers`
    return this.client.request("POST", path, payload)
  }

  /**
   * Retrieves the customer that is currently logged
   * @return {ResponsePromise<StoreCustomersRes>}
   */
  retrieve(): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/me`
    return this.client.request("GET", path)
  }

  /**
   * Updates a customer
   * @param {StorePostCustomersCustomerReq} payload information to update customer with
   * @return {ResponsePromise<StoreCustomersRes>}
   */
  update(
    payload: StorePostCustomersCustomerReq
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/me`
    return this.client.request("POST", path, payload)
  }

  /**
   * Retrieve customer orders
   * @param {StoreGetCustomersCustomerOrdersParams} params optional params to retrieve orders
   * @return {ResponsePromise<StoreCustomersListOrdersRes>}
   */
  listOrders(
    params?: StoreGetCustomersCustomerOrdersParams
  ): ResponsePromise<StoreCustomersListOrdersRes> {
    let path = `/store/customers/me/orders`
    if (params) {
      let query: string | undefined

      for (const key of Object.keys(params)) {
        if (query) {
          query += `&${key}=${params[key]}`
        } else {
          query = `?${key}=${params[key]}`
        }
      }

      if (query) {
        path += query
      }
    }
    return this.client.request("GET", path)
  }

  /**
   * Resets customer password
   * @param {StorePostCustomersCustomerPasswordTokenReq} payload info used to reset customer password
   * @return {ResponsePromise<StoreCustomersRes>}
   */
  resetPassword(
    payload: StorePostCustomersCustomerPasswordTokenReq
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/password-reset`
    return this.client.request("POST", path, payload)
  }

  /**
   * Generates a reset password token, which can be used to reset the password.
   * The token is not returned but should be sent out to the customer in an email.
   * @param {StorePostCustomersCustomerPasswordTokenReq} payload info used to generate token
   * @return {ResponsePromise}
   */
  generatePasswordToken(
    payload: StorePostCustomersCustomerPasswordTokenReq
  ): ResponsePromise {
    const path = `/store/customers/password-token`
    return this.client.request("POST", path, payload)
  }
}

export default CustomerResource
