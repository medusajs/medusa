/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetCollectionsParams = {
  /**
   * The number of collections to return.
   */
  limit?: number;
  /**
   * The number of collections to skip before the results.
   */
  offset?: number;
  /**
   * The title of collections to return.
   */
  title?: string;
  /**
   * The handle of collections to return.
   */
  handle?: string;
  /**
   * a search term to search titles and handles.
   */
  'q'?: string;
  /**
   * The discount condition id on which to filter the product collections.
   */
  discountConditionId?: string;
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
  /**
   * Date comparison for when resulting collections were deleted.
   */
  deletedAt?: {
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

