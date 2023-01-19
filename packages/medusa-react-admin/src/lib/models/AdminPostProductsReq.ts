/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminPostProductsReq = {
  /**
   * The title of the Product
   */
  title: string;
  /**
   * The subtitle of the Product
   */
  subtitle?: string;
  /**
   * A description of the Product.
   */
  description?: string;
  /**
   * A flag to indicate if the Product represents a Gift Card. Purchasing Products with this flag set to `true` will result in a Gift Card being created.
   */
  is_giftcard?: boolean;
  /**
   * A flag to indicate if discounts can be applied to the LineItems generated from this Product
   */
  discountable?: boolean;
  /**
   * Images of the Product.
   */
  images?: Array<string>;
  /**
   * The thumbnail to use for the Product.
   */
  thumbnail?: string;
  /**
   * A unique handle to identify the Product by.
   */
  handle?: string;
  /**
   * The status of the product.
   */
  status?: 'draft' | 'proposed' | 'published' | 'rejected';
  /**
   * The Product Type to associate the Product with.
   */
  type?: {
    /**
     * The ID of the Product Type.
     */
    id?: string;
    /**
     * The value of the Product Type.
     */
    value: string;
  };
  /**
   * The ID of the Collection the Product should belong to.
   */
  collection_id?: string;
  /**
   * Tags to associate the Product with.
   */
  tags?: Array<any>;
  /**
   * [EXPERIMENTAL] Sales channels to associate the Product with.
   */
  sales_channels?: Array<any>;
  /**
   * The Options that the Product should have. These define on which properties the Product's Product Variants will differ.
   */
  options?: Array<any>;
  /**
   * A list of Product Variants to create with the Product.
   */
  variants?: Array<any>;
  /**
   * The weight of the Product.
   */
  weight?: number;
  /**
   * The length of the Product.
   */
  length?: number;
  /**
   * The height of the Product.
   */
  height?: number;
  /**
   * The width of the Product.
   */
  width?: number;
  /**
   * The Harmonized System code for the Product Variant.
   */
  hs_code?: string;
  /**
   * The country of origin of the Product.
   */
  origin_country?: string;
  /**
   * The Manufacturer Identification code for the Product.
   */
  mid_code?: string;
  /**
   * The material composition of the Product.
   */
  material?: string;
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>;
};

