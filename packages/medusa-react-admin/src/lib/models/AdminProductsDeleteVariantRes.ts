/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Product } from './Product';

export type AdminProductsDeleteVariantRes = {
  /**
   * The ID of the deleted Product Variant.
   */
  variant_id?: string;
  /**
   * The type of the object that was deleted.
   */
  object?: string;
  /**
   * Whether or not the items were deleted.
   */
  deleted?: boolean;
  product?: Product;
};

