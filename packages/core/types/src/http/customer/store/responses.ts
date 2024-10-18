import { DeleteResponseWithParent, PaginatedResponse } from "../../common"
import { StoreCustomer, StoreCustomerAddress } from "./entities"

export interface StoreCustomerResponse {
  /**
   * The customer's details.
   */
  customer: StoreCustomer
}

export interface StoreCustomerAddressResponse {
  /**
   * The address's details.
   */
  address: StoreCustomerAddress
}

export interface StoreCustomerAddressListResponse
  extends PaginatedResponse<{ 
    /**
     * The paginated list of addresses.
     */
    addresses: StoreCustomerAddress[] 
  }> {}

export type StoreCustomerAddressDeleteResponse = DeleteResponseWithParent<
  "address",
  StoreCustomer
>
