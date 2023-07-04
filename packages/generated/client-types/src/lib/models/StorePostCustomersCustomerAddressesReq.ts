/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { AddressCreatePayload } from "./AddressCreatePayload"

export interface StorePostCustomersCustomerAddressesReq {
  /**
   * The Address to add to the Customer.
   */
  address: AddressCreatePayload
}
