import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"
import { BaseProductListParams, BaseProductOptionParams } from "../common"

/**
 * The product option's details.
 */
export interface AdminProductOptionParams
  extends Omit<BaseProductOptionParams, "product_id"> {}
/**
 * The filters to apply on the retrieved product variants.
 */
export interface AdminProductVariantParams
  extends FindParams,
    BaseFilterable<AdminProductVariantParams> {
  /**
   * Query or keywords to filter the variant's searchable fields.
   */
  q?: string
  /**
   * Filter by variant ID(s).
   */
  id?: string | string[]
  /**
   * Filter by whether Medusa manages the inventory of the variant.
   */
  manage_inventory?: boolean
  /**
   * Filter by whether the variant can be ordered even if it's
   * out of stock.
   */
  allow_backorder?: boolean
  /**
   * Filter by sku(s).
   */
  sku?: string | string[]
  /**
   * Filter by variant ean(s).
   */
  ean?: string | string[]
  /**
   * Filter by variant upc(s).
   */
  upc?: string | string[]
  /**
   * Filter by variant barcode(s).
   */
  barcode?: string | string[]
  /**
   * Apply filters on the variant's creation date.
   */
  created_at?: OperatorMap<string>
  /**
   * Apply filters on the variant's update date.
   */
  updated_at?: OperatorMap<string>
  /**
   * Apply filters on the variant's deletion date.
   */
  deleted_at?: OperatorMap<string>
}
/**
 * The filters to apply on the retrieved products.
 */
export interface AdminProductListParams
  extends Omit<BaseProductListParams, "categories"> {
  /**
   * Filter by price list ID(s) to retrieve the associated products only.
   */
  price_list_id?: string | string[]
  /**
   * Apply filters on the product variants.
   */
  variants?: Omit<AdminProductVariantParams, "q">
}

/**
 * The filters to apply on the retrieved products to export.
 */
export interface AdminProductExportParams extends Omit<AdminProductListParams, "tags" | "variants"> {
  /**
   * Filter by tag ID(s).
   */
  tags?: {
    /**
     * The tag ID(s) to filter by.
     */
    id?: string[]
  }
  /**
   * Apply filters on the product variants.
   */
  variants?: { 
    /**
     * Filter by variant sku(s).
     *
     * @since 2.13.7
     */
    sku?: string | string[] | OperatorMap<string | string[]>
    /**
     * Filter by variant ean(s).
     *
     * @since 2.13.7
     */
    ean?: string | string[] | OperatorMap<string | string[]>
    /**
     * Filter by variant upc(s).
     *
     * @since 2.13.7
     */
    upc?: string | string[] | OperatorMap<string | string[]>
    /**
     * Filter by variant barcode(s).
     *
     * @since 2.13.7
     */
    barcode?: string | string[] | OperatorMap<string | string[]>
    /**
     * Apply filters on the product variant's options.
     */
    options?: { 
      /**
       * Filter by option value(s).
       */
      value?: string
      /**
       * Filter by option ID(s).
       */
      option_id?: string
      /**
       * Apply filters on the option.
       */
      option?: Record<string, any>
    }
  }
}

export interface AdminGetProductParams extends SelectParams {}
