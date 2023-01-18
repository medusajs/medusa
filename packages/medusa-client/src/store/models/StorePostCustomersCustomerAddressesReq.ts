/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddressFields } from './AddressFields';

export type StorePostCustomersCustomerAddressesReq = {
  /**
   * The Address to add to the Customer.
   */
  address: (AddressFields & Record<string, any>);
};

