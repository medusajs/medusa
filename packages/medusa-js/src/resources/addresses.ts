import {
  StoreCustomersRes,
  StorePostCustomersCustomerAddressesAddressReq,
  StorePostCustomersCustomerAddressesReq,
} from "@medusajs/medusa"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"

class AddressesResource extends BaseResource {
  /**
   * Adds an address to a customers saved addresses
   * @param {StorePostCustomersCustomerAddressesReq} payload contains information to create an address
   * @param customHeaders
   * @return {ResponsePromise<StoreCustomersRes>}
   */
  addAddress(
    payload: StorePostCustomersCustomerAddressesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/me/addresses`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Deletes an address of a customer
   * @param {string} address_id id of the address to delete
   * @param customHeaders
   * @return {ResponsePromise<StoreCustomersRes>}
   */
  deleteAddress(
    address_id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreCustomersRes> {
    const path = `/store/customers/me/addresses/${address_id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Update an address of a customer
   * @param {string} address_id id of customer
   * @param {StorePostCustomersCustomerAddressesAddressReq} payload address update
   * @param customHeaders
   * @return {StoreCustomersRes}
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
