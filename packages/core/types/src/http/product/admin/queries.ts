import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams } from "../../common"
import { BaseProductListParams, BaseProductOptionParams } from "../common"

export interface AdminProductOptionParams
  extends Omit<BaseProductOptionParams, "product_id"> {}
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

export interface AdminProductExportParams extends Omit<AdminProductListParams, "tags" | "variants"> {
  tags?: {
    id?: string[]
  }
  variants?: { 

    sku?: string | string[] | OperatorMap<string | string[]>
    ean?: string | string[] | OperatorMap<string | string[]>
    upc?: string | string[] | OperatorMap<string | string[]>
    barcode?: string | string[] | OperatorMap<string | string[]>
    
    options?: { 
      value?: string
      option_id?: string
      option?: Record<string, any>
    }
  }
}