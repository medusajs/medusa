/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetOrdersParams = {
  /**
   * Query used for searching orders by shipping address first name, orders' email, and orders' display ID
   */
  'q'?: string;
  /**
   * ID of the order to search for.
   */
  id?: string;
  /**
   * Status to search for
   */
  status?: Array<'pending' | 'completed' | 'archived' | 'canceled' | 'requires_action'>;
  /**
   * Fulfillment status to search for.
   */
  fulfillmentStatus?: Array<'not_fulfilled' | 'fulfilled' | 'partially_fulfilled' | 'shipped' | 'partially_shipped' | 'canceled' | 'returned' | 'partially_returned' | 'requires_action'>;
  /**
   * Payment status to search for.
   */
  paymentStatus?: Array<'captured' | 'awaiting' | 'not_paid' | 'refunded' | 'partially_refunded' | 'canceled' | 'requires_action'>;
  /**
   * Display ID to search for.
   */
  displayId?: string;
  /**
   * to search for.
   */
  cartId?: string;
  /**
   * to search for.
   */
  customerId?: string;
  /**
   * to search for.
   */
  email?: string;
  /**
   * Regions to search orders by
   */
  regionId?: (string | Array<string>);
  /**
   * Currency code to search for
   */
  currencyCode?: string;
  /**
   * to search for.
   */
  taxRate?: string;
  /**
   * Date comparison for when resulting orders were created.
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
   * Date comparison for when resulting orders were updated.
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
   * Date comparison for when resulting orders were canceled.
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
   * Filter by Sales Channels
   */
  salesChannelId?: Array<string>;
  /**
   * How many orders to skip before the results.
   */
  offset?: number;
  /**
   * Limit the number of orders returned.
   */
  limit?: number;
  /**
   * (Comma separated) Which fields should be expanded in each order of the result.
   */
  expand?: string;
  /**
   * (Comma separated) Which fields should be included in each order of the result.
   */
  fields?: string;
};

