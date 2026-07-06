import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminStockLocationListParams
  extends FindParams,
    BaseFilterable<AdminStockLocationListParams> {
  /**
   * Filter by stock location ID(s).
   */
  id?: string | string[]
  /**
   * Query or keywords to search the stock location's searchable fields.
   */
  q?: string
  /**
   * Filter by stock location name.
   */
  name?: string | string[]
  /**
   * Filter by stock location address ID(s).
   */
  address_id?: string | string[]
  /**
   * Filter by sales channel ID(s) to retrieve the stock locations for.
   */
  sales_channel_id?: string | string[]
  /**
   * Filter by the date the stock location was created.
   */
  created_at?: OperatorMap<string>
  /**
   * Filter by the date the stock location was updated.
   */
  updated_at?: OperatorMap<string>
  /**
   * Filter by the date the stock location was deleted.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminGetStockLocationParams extends SelectParams {}

