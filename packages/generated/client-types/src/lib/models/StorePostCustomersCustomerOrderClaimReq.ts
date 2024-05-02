/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

/**
 * The details of the orders to claim.
 */
export interface StorePostCustomersCustomerOrderClaimReq {
  /**
   * The ID of the orders to claim
   */
  order_ids: Array<string>;
};


