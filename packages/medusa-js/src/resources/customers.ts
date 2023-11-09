import {
  StoreCustomersListOrdersRes,
  StoreCustomersRes,
  StoreGetCustomersCustomerOrdersParams,
  StorePostCustomersCustomerPasswordTokenReq,
  StorePostCustomersCustomerReq,
  StorePostCustomersReq,
  StorePostCustomersResetPasswordReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import AddressesResource from "./addresses"
import BaseResource from "./base"
import PaymentMethodsResource from "./payment-methods"

/**
 * This class is used to send requests to [Store Customer API Routes](https://docs.medusajs.com/api/store#customers_postcustomers). All its method
 * are available in the JS Client under the `medusa.customers` property.
 * 
 * A customer can register and manage their information such as addresses, orders, payment methods, and more.
 * 
 * Related Guide: [How to implement customer profiles in your storefront](https://docs.medusajs.com/modules/customers/storefront/implement-customer-profiles).
 */
class CustomerResource extends BaseResource {
  /**
   * An instance of {@link PaymentMethodsResource} used to send requests to payment-related routes part of the [Store Customer API Routes](https://docs.medusajs.com/api/store#customers_postcustomers).
   */
  public paymentMethods = new PaymentMethodsResource(this.client)
  /**
   * An instance of {@link AddressesResource} used to send requests to address-related routes part of the [Store Customer API Routes](https://docs.medusajs.com/api/store#customers_postcustomers).
   */
  public addresses = new AddressesResource(this.client)

  /**
   * Register a new customer. This will also automatically authenticate the customer and set their login session in the response Cookie header.
   * Subsequent requests sent with the JS client are sent with the Cookie session automatically.
   * @param {StorePostCustomersReq} payload - The details of the customer to be created.
   * @param {string} query - Filters and pagination configurations to apply on the retrieved product collections.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns { ResponsePromise<StoreCustomersRes>} Resolves to the created customer's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.customers.create({
   *   first_name: "Alec",
   *   last_name: "Reynolds",
   *   email: "user@example.com",
   *   password: "supersecret"
   * })
   * .then(({ customer }) => {
   *   console.log(customer.id);
   * })
   */
  create(
    payload: StorePostCustomersReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve the logged-in customer's details. This method requires {@link AuthResource.authenticate | customer authentication}.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCustomersRes>} Resolves to the logged-in customer's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged
   * medusa.customers.retrieve()
   * .then(({ customer }) => {
   *   console.log(customer.id);
   * })
   */
  retrieve(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/me`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Update the logged-in customer's details. This method requires {@link AuthResource.authenticate | customer authentication}.
   * @param {StorePostCustomersCustomerReq} payload - The attributes to update in the logged-in customer.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCustomersRes>} Resolves to the logged-in customer's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged
   * medusa.customers.update({
   *   first_name: "Laury"
   * })
   * .then(({ customer }) => {
   *   console.log(customer.id);
   * })
   */
  update(
    payload: StorePostCustomersCustomerReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/me`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve a list of the logged-in customer's orders. The orders can be filtered by fields such as `status` or `fulfillment_status`. The orders can also be paginated.
   * This method requires {@link AuthResource.authenticate | customer authentication}.
   * @param {StoreGetCustomersCustomerOrdersParams} params - Filters and pagination configurations to apply on the retrieved orders.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCustomersListOrdersRes>} Resolves to the list of orders with pagination fields.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged
   * medusa.customers.listOrders()
   * .then(({ orders, limit, offset, count }) => {
   *   console.log(orders);
   * })
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
   * Reset a customer's password using a password token created by a previous request using the {@link generatePasswordToken} method. If the password token expired,
   * you must create a new one.
   * @param {StorePostCustomersResetPasswordReq} payload - The necessary details to reset the password.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCustomersRes>} Resolves to the customer's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.customers.resetPassword({
   *   email: "user@example.com",
   *   password: "supersecret",
   *   token: "supersecrettoken"
   * })
   * .then(({ customer }) => {
   *   console.log(customer.id);
   * })
   */
  resetPassword(
    payload: StorePostCustomersResetPasswordReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/password-reset`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create a reset password token to be used when sending a request with the {@link resetPassword} method. This emits the event `customer.password_reset`. If a notification provider is
   * installed in the Medusa backend and is configured to handle this event, a notification to the customer, such as an email, may be sent with reset instructions.
   * @param {StorePostCustomersCustomerPasswordTokenReq} payload - The necessary details to create the reset password token.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise} Resolves when reset password token is created successfully.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.customers.generatePasswordToken({
   *   email: "user@example.com"
   * })
   * .then(() => {
   *   // successful
   * })
   * .catch(() => {
   *   // failed
   * })
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
