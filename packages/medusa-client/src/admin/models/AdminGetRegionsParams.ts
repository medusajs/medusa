/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetRegionsParams = {
  /**
   * limit the number of regions in response
   */
  limit?: number;
  /**
   * Offset of regions in response (used for pagination)
   */
  offset?: number;
  /**
   * Date comparison for when resulting region was created, i.e. less than, greater than etc.
   */
  createdAt?: Record<string, any>;
  /**
   * Date comparison for when resulting region was updated, i.e. less than, greater than etc.
   */
  updatedAt?: Record<string, any>;
  /**
   * Date comparison for when resulting region was deleted, i.e. less than, greater than etc.
   */
  deletedAt?: Record<string, any>;
};

