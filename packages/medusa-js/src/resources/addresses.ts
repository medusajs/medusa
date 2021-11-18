import {
  StoreCustomersRes,
  StorePostCustomersCustomerAddressesAddressReq,
  StorePostCustomersCustomerAddressesReq,
} from "@medusajs/medusa"
import { AxiosPromise } from "axios"
import BaseResource from "./base"

class AddressesResource extends BaseResource {
  /**
   * Adds an address to a customers saved addresses
   * @param {StorePostCustomersCustomerAddressesReq} payload contains information to create an address
   * @return {AxiosPromise<StoreCustomerResponse>}
   */
  addAddress(
    payload: StorePostCustomersCustomerAddressesReq
  ): AxiosPromise<StoreCustomersRes> {
    const path = `/store/customers/me/addresses`
    return this.client.request("POST", path, payload)
  }

  /**
   * Deletes an address of a customer
   * @param {string} address_id id of the address to delete
   * @return {AxiosPromise<StoreCustomersResponse>}
   */
  deleteAddress(address_id: string): AxiosPromise<StoreCustomersRes> {
    const path = `/store/customers/me/addresses/${address_id}`
    return this.client.request("DELETE", path)
  }

  /**
   * Update an address of a customer
   * @param {string} address_id id of customer
   * @param {StorePostCustomersCustomerAddressesAddressReq} payload address update
   * @return {StoreCustomersResponse}
   */
  updateAddress(
    address_id: string,
    payload: StorePostCustomersCustomerAddressesAddressReq
  ): AxiosPromise<StoreCustomersRes> {
    const path = `/store/customers/me/addresses/${address_id}`
    return this.client.request("POST", path, payload)
  }
}

export default AddressesResource
