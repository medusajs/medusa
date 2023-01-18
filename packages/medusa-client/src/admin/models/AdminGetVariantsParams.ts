/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminGetVariantsParams = {
  /**
   * A Product Variant id to filter by.
   */
  id?: string;
  /**
   * A comma separated list of Product Variant ids to filter by.
   */
  ids?: string;
  /**
   * A comma separated list of Product Variant relations to load.
   */
  expand?: string;
  /**
   * A comma separated list of Product Variant fields to include.
   */
  fields?: string;
  /**
   * How many product variants to skip in the result.
   */
  offset?: number;
  /**
   * Maximum number of Product Variants to return.
   */
  limit?: number;
  /**
   * The id of the cart to use for price selection.
   */
  cartId?: string;
  /**
   * The id of the region to use for price selection.
   */
  regionId?: string;
  /**
   * The currency code to use for price selection.
   */
  currencyCode?: string;
  /**
   * The id of the customer to use for price selection.
   */
  customerId?: string;
  /**
   * product variant title to search for.
   */
  title?: (string | Array<string>);
  /**
   * Filter by available inventory quantity
   */
  inventoryQuantity?: (number | {
    /**
     * filter by inventory quantity less than this number
     */
    lt?: number;
    /**
     * filter by inventory quantity greater than this number
     */
    gt?: number;
    /**
     * filter by inventory quantity less than or equal to this number
     */
    lte?: number;
    /**
     * filter by inventory quantity greater than or equal to this number
     */
    gte?: number;
  });
};

