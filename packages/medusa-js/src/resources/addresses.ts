import {
  StoreCustomersRes,
  StorePostCustomersCustomerAddressesAddressReq,
  StorePostCustomersCustomerAddressesReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

/**
 * This class is used to send requests to Address API Routes part of the [Store Customer API Routes](https://docs.medusajs.com/api/store#customers_postcustomers). All its method
 * are available in the JS Client under the `medusa.customers.addresses` property.
 * 
 * All methods in this class require {@link AuthResource.authenticate | customer authentication}.
 */
class AddressesResource extends BaseResource {
  /**
   * Add an address to the logged-in customer's saved addresses.
   * @param {StorePostCustomersCustomerAddressesReq} payload - The address to add.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCustomersRes>} Resolves to the customer's details, including the customer's addresses in the `shipping_addresses` attribute.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged
   * medusa.customers.addresses.addAddress({
   *   address: {
   *     first_name: "Celia",
   *     last_name: "Schumm",
   *     address_1: "225 Bednar Curve",
   *     city: "Danielville",
   *     country_code: "US",
   *     postal_code: "85137",
   *     phone: "981-596-6748 x90188",
   *     company: "Wyman LLC",
   *     province: "Georgia",
   *   }
   * })
   * .then(({ customer }) => {
   *   console.log(customer.id);
   * })
   */
  addAddress(
    payload: StorePostCustomersCustomerAddressesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/me/addresses`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete an address of the logged-in customer.
   * @param {string} address_id - The ID of the address to delete.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCustomersRes>} Resolves to the customer's details, including the customer's addresses in the `shipping_addresses` attribute.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged
   * medusa.customers.addresses.deleteAddress(addressId)
   * .then(({ customer }) => {
   *   console.log(customer.id);
   * })
   */
  deleteAddress(
    address_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/me/addresses/${address_id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Update an address of the logged-in customer.
   * @param {string} address_id - The address's ID.
   * @param {StorePostCustomersCustomerAddressesAddressReq} payload - The attributes to update in the address.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreCustomersRes>} Resolves to the customer's details, including the customer's addresses in the `shipping_addresses` attribute.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged
   * medusa.customers.addresses.updateAddress(addressId, {
   *   first_name: "Gina"
   * })
   * .then(({ customer }) => {
   *   console.log(customer.id);
   * })
   */
  updateAddress(
    address_id: string,
    payload: StorePostCustomersCustomerAddressesAddressReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/me/addresses/${address_id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }
}

export default AddressesResource
