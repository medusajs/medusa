import {
  StoreCustomersListOrdersRes,
  StoreCustomersRes,
  StoreGetCustomersCustomerOrdersParams,
  StorePostCustomersCustomerPasswordTokenReq,
  StorePostCustomersCustomerReq,
  StorePostCustomersReq,
} from "@medusajs/medusa"
import qs from "qs"
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
   * @param customHeaders
   * @return { ResponsePromise<StoreCustomersRes>}
   */
  create(
    payload: StorePostCustomersReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieves the customer that is currently logged
   * @param customHeaders
   * @return {ResponsePromise<StoreCustomersRes>}
   */
  retrieve(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/me`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Updates a customer
   * @param {StorePostCustomersCustomerReq} payload information to update customer with
   * @param customHeaders
   * @return {ResponsePromise<StoreCustomersRes>}
   */
  update(
    payload: StorePostCustomersCustomerReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/me`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve customer orders
   * @param {StoreGetCustomersCustomerOrdersParams} params optional params to retrieve orders
   * @param customHeaders
   * @return {ResponsePromise<StoreCustomersListOrdersRes>}
   */
  listOrders(
    params?: StoreGetCustomersCustomerOrdersParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersListOrdersRes> {
    let path = `/store/customers/me/orders`
    if (params) {
      const query = qs.stringify(params)
      if (query) {
        path += `?${query}`
      }
    }
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Resets customer password
   * @param {StorePostCustomersCustomerPasswordTokenReq} payload info used to reset customer password
   * @param customHeaders
   * @return {ResponsePromise<StoreCustomersRes>}
   */
  resetPassword(
    payload: StorePostCustomersCustomerPasswordTokenReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/password-reset`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Generates a reset password token, which can be used to reset the password.
   * The token is not returned but should be sent out to the customer in an email.
   * @param {StorePostCustomersCustomerPasswordTokenReq} payload info used to generate token
   * @param customHeaders
   * @return {ResponsePromise}
   */
  generatePasswordToken(
    payload: StorePostCustomersCustomerPasswordTokenReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise {
    const path = `/store/customers/password-token`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default CustomerResource
