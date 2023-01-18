/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetBatchParams = {
  /**
   * The number of batch jobs to return.
   */
  limit?: number;
  /**
   * The number of batch jobs to skip before results.
   */
  offset?: number;
  /**
   * Filter by the batch ID
   */
  id?: (string | Array<string>);
  /**
   * Filter by the batch type
   */
  type?: Array<string>;
  /**
   * Date comparison for when resulting collections was confirmed, i.e. less than, greater than etc.
   */
  confirmedAt?: {
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
   * Date comparison for when resulting collections was pre processed, i.e. less than, greater than etc.
   */
  preProcessedAt?: {
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
   * Date comparison for when resulting collections was completed, i.e. less than, greater than etc.
   */
  completedAt?: {
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
   * Date comparison for when resulting collections was failed, i.e. less than, greater than etc.
   */
  failedAt?: {
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
   * Date comparison for when resulting collections was canceled, i.e. less than, greater than etc.
   */
  canceledAt?: {
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
   * Field used to order retrieved batch jobs
   */
  order?: string;
  /**
   * (Comma separated) Which fields should be expanded in each order of the result.
   */
  expand?: string;
  /**
   * (Comma separated) Which fields should be included in each order of the result.
   */
  fields?: string;
  /**
   * Date comparison for when resulting collections was created, i.e. less than, greater than etc.
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
   * Date comparison for when resulting collections was updated, i.e. less than, greater than etc.
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

