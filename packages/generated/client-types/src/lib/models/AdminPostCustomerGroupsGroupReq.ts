/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

/**
 * The details to update in the customer group.
 */
export interface AdminPostCustomerGroupsGroupReq {
  /**
   * Name of the customer group
   */
  name?: string;
  /**
   * Metadata of the customer group.
   */
  metadata?: Record<string, any>;
};


