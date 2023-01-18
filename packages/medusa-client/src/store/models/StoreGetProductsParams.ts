/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StoreGetProductsParams = {
  /**
   * Query used for searching products by title, description, variant's title, variant's sku, and collection's title
   */
  'q'?: string;
  /**
   * product IDs to search for.
   */
  id?: (string | Array<string>);
  /**
   * an array of sales channel IDs to filter the retrieved products by.
   */
  salesChannelId?: Array<string>;
  /**
   * Collection IDs to search for
   */
  collectionId?: Array<string>;
  /**
   * Type IDs to search for
   */
  typeId?: Array<string>;
  /**
   * Tag IDs to search for
   */
  tags?: Array<string>;
  /**
   * title to search for.
   */
  title?: string;
  /**
   * description to search for.
   */
  description?: string;
  /**
   * handle to search for.
   */
  handle?: string;
  /**
   * Search for giftcards using is_giftcard=true.
   */
  isGiftcard?: boolean;
  /**
   * Date comparison for when resulting products were created.
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
   * Date comparison for when resulting products were updated.
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
   * How many products to skip in the result.
   */
  offset?: number;
  /**
   * Limit the number of products returned.
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
  /**
   * the field used to order the products.
   */
  order?: string;
  /**
   * The id of the Cart to set prices based on.
   */
  cartId?: string;
  /**
   * The id of the Region to set prices based on.
   */
  regionId?: string;
  /**
   * The currency code to use for price selection.
   */
  currencyCode?: string;
};

