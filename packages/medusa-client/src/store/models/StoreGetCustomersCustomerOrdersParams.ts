/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StoreGetCustomersCustomerOrdersParams = {
  /**
   * Query used for searching orders.
   */
  'q'?: string;
  /**
   * Id of the order to search for.
   */
  id?: string;
  /**
   * Status to search for.
   */
  status?: Array<string>;
  /**
   * Fulfillment status to search for.
   */
  fulfillmentStatus?: Array<string>;
  /**
   * Payment status to search for.
   */
  paymentStatus?: Array<string>;
  /**
   * Display id to search for.
   */
  displayId?: string;
  /**
   * to search for.
   */
  cartId?: string;
  /**
   * to search for.
   */
  email?: string;
  /**
   * to search for.
   */
  regionId?: string;
  /**
   * The 3 character ISO currency code to set prices based on.
   */
  currencyCode?: string;
  /**
   * to search for.
   */
  taxRate?: string;
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
   * Date comparison for when resulting collections were canceled.
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
   * How many orders to return.
   */
  limit?: number;
  /**
   * The offset in the resulting orders.
   */
  offset?: number;
  /**
   * (Comma separated string) Which fields should be included in the resulting orders.
   */
  fields?: string;
  /**
   * (Comma separated string) Which relations should be expanded in the resulting orders.
   */
  expand?: string;
};

