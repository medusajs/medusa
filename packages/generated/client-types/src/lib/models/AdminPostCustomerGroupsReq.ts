/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

/**
 * The details of the customer group to create.
 */
export interface AdminPostCustomerGroupsReq {
  /**
   * Name of the customer group
   */
  name: string;
  /**
   * Metadata of the customer group.
   */
  metadata?: Record<string, any>;
};


