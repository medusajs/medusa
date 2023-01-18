/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetProductsParams = {
  /**
   * Query used for searching product title and description, variant title and sku, and collection title.
   */
  'q'?: string;
  /**
   * The discount condition id on which to filter the product.
   */
  discountConditionId?: string;
  /**
   * Filter by product IDs.
   */
  id?: (string | Array<string>);
  /**
   * Status to search for
   */
  status?: Array<'draft' | 'proposed' | 'published' | 'rejected'>;
  /**
   * Collection ids to search for.
   */
  collectionId?: Array<string>;
  /**
   * Tag IDs to search for
   */
  tags?: Array<string>;
  /**
   * Price List IDs to search for
   */
  priceListId?: Array<string>;
  /**
   * Sales Channel IDs to filter products by
   */
  salesChannelId?: Array<string>;
  /**
   * Type IDs to filter products by
   */
  typeId?: Array<string>;
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
   * Date comparison for when resulting products were deleted.
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
  /**
   * How many products to skip in the result.
   */
  offset?: number;
  /**
   * Limit the number of products returned.
   */
  limit?: number;
  /**
   * (Comma separated) Which fields should be expanded in each product of the result.
   */
  expand?: string;
  /**
   * (Comma separated) Which fields should be included in each product of the result.
   */
  fields?: string;
  /**
   * the field used to order the products.
   */
  order?: string;
};

