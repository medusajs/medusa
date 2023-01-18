/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StoreGetCollectionsParams = {
  /**
   * The number of collections to skip before starting to collect the collections set
   */
  offset?: number;
  /**
   * The number of collections to return
   */
  limit?: number;
  /**
   * Date comparison for when resulting collections were created.
   */
  createdAt?: {
    /**
     * filter by dates less than this date
     */
    lt?: string;
    /**
     * filter by dates greater than this date
     */
    gt?: string;
    /**
     * filter by dates less than or equal to this date
     */
    lte?: string;
    /**
     * filter by dates greater than or equal to this date
     */
    gte?: string;
  };
  /**
   * Date comparison for when resulting collections were updated.
   */
  updatedAt?: {
    /**
     * filter by dates less than this date
     */
    lt?: string;
    /**
     * filter by dates greater than this date
     */
    gt?: string;
    /**
     * filter by dates less than or equal to this date
     */
    lte?: string;
    /**
     * filter by dates greater than or equal to this date
     */
    gte?: string;
  };
};

